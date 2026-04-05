import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDb,
  type DocumentSnapshot,
} from '@/lib/firebase/firebase-firestore'
import { obtenerAnuncioPorId } from '@/features/listings/services/listing-service'
import { construirEnlaceWhatsApp, construirMensajeRenta } from '@/lib/dominio/construir-enlace-whatsapp'
import { obtenerTelefonoUsuario } from '@/features/profile/services/user-service'
import { registrarError } from '@/lib/registrar-error'
import type { SolicitudRenta, FormularioSolicitud, FormularioMarcarAlquilado, EstadoSolicitud, EstadoDisponibilidad } from '../types'

const RENTAL_REQUESTS_COLLECTION = 'rentalRequests'

function docToSolicitudRenta(docSnap: DocumentSnapshot): SolicitudRenta | null {
  if (!docSnap.exists()) return null
  const data = docSnap.data()!
  return {
    id: docSnap.id,
    listingId: data.listingId,
    listingTitle: data.listingTitle,
    renterId: data.renterId,
    renterName: data.renterName,
    renterEmail: data.renterEmail,
    renterPhone: data.renterPhone,
    startDateTime: data.startDateTime?.toDate() || new Date(),
    endDateTime: data.endDateTime?.toDate() || new Date(),
    notes: data.notes || '',
    status: data.status,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as SolicitudRenta
}

export async function crearSolicitudRenta(
  listingId: string,
  renterId: string,
  formulario: FormularioSolicitud
): Promise<SolicitudRenta> {
  try {
    // Get listing and user information
    const [anuncio, renterDoc] = await Promise.all([
      obtenerAnuncioPorId(listingId),
      getDoc(doc(getDb(), 'users', renterId))
    ])

    if (!anuncio) {
      throw new Error('Anuncio no encontrado')
    }

    if (!renterDoc.exists()) {
      throw new Error('Usuario no encontrado')
    }

    const renterData = renterDoc.data()
    const renterName = renterData.displayName || renterData.email
    const renterEmail = renterData.email
    const renterPhone = renterData.phone

    // Validate dates
    const startDate = new Date(formulario.startDateTime)
    const endDate = new Date(formulario.endDateTime)
    
    if (endDate <= startDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio')
    }

    // Check for overlapping requests
    const solicitudesExistentes = await obtenerSolicitudesPorAnuncio(listingId)
    const solapamiento = solicitudesExistentes.some(solicitud => 
      solicitud.status === 'aprobada' &&
      startDate < solicitud.endDateTime &&
      endDate > solicitud.startDateTime
    )

    if (solapamiento) {
      throw new Error('El artículo ya está alquilado en las fechas seleccionadas')
    }

    const nuevaSolicitud: Omit<SolicitudRenta, 'id' | 'createdAt' | 'updatedAt'> = {
      listingId,
      listingTitle: anuncio.title,
      renterId,
      renterName,
      renterEmail,
      renterPhone,
      startDateTime: startDate,
      endDateTime: endDate,
      notes: formulario.notes,
      status: 'pendiente',
    }

    const docRef = await addDoc(collection(getDb(), RENTAL_REQUESTS_COLLECTION), {
      ...nuevaSolicitud,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const solicitudCreada = await getDoc(docRef)
    const solicitud = docToSolicitudRenta(solicitudCreada)

    if (!solicitud) {
      throw new Error('Error al crear la solicitud')
    }

    // Send WhatsApp message to lister
    await enviarMensajeWhatsAppListero(anuncio.ownerId, solicitud)

    return solicitud
  } catch (error) {
    registrarError(error, 'RentalService:crearSolicitudRenta')
    throw error
  }
}

export async function obtenerSolicitudesPorAnuncio(listingId: string): Promise<SolicitudRenta[]> {
  try {
    const q = query(
      collection(getDb(), RENTAL_REQUESTS_COLLECTION),
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(docToSolicitudRenta).filter(Boolean) as SolicitudRenta[]
  } catch (error) {
    registrarError(error, 'RentalService:obtenerSolicitudesPorAnuncio')
    return []
  }
}

export async function obtenerSolicitudesPorRenter(renterId: string): Promise<SolicitudRenta[]> {
  try {
    const q = query(
      collection(getDb(), RENTAL_REQUESTS_COLLECTION),
      where('renterId', '==', renterId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(docToSolicitudRenta).filter(Boolean) as SolicitudRenta[]
  } catch (error) {
    registrarError(error, 'RentalService:obtenerSolicitudesPorRenter')
    return []
  }
}

export async function actualizarEstadoSolicitud(
  solicitudId: string,
  nuevoEstado: EstadoSolicitud
): Promise<void> {
  try {
    const docRef = doc(getDb(), RENTAL_REQUESTS_COLLECTION, solicitudId)
    await updateDoc(docRef, {
      status: nuevoEstado,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    registrarError(error, 'RentalService:actualizarEstadoSolicitud')
    throw error
  }
}

export async function actualizarEstadoAnuncio(
  listingId: string,
  availabilityStatus: EstadoDisponibilidad
): Promise<void> {
  try {
    const docRef = doc(getDb(), 'listings', listingId)
    await updateDoc(docRef, {
      availabilityStatus,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    registrarError(error, 'RentalService:actualizarEstadoAnuncio')
    throw error
  }
}

async function enviarMensajeWhatsAppListero(ownerId: string, solicitud: SolicitudRenta): Promise<void> {
  try {
    const listerPhone = await obtenerTelefonoUsuario(ownerId)
    
    if (!listerPhone) {
      console.warn('No phone number found for lister:', ownerId)
      return
    }

    const mensaje = construirMensajeRenta(
      solicitud.listingTitle,
      solicitud.renterName,
      solicitud.renterEmail,
      solicitud.renterPhone,
      solicitud.startDateTime,
      solicitud.endDateTime,
      solicitud.notes
    )

    const enlace = construirEnlaceWhatsApp(listerPhone, mensaje)
    
    // Open WhatsApp in a new window
    window.open(enlace, '_blank', 'noopener,noreferrer')
  } catch (error) {
    registrarError(error, 'RentalService:enviarMensajeWhatsAppListero')
    // Don't throw here - this is not critical for the rental request creation
  }
}

export async function marcarAnuncioComoAlquilado(
  listingId: string,
  formulario: FormularioMarcarAlquilado
): Promise<void> {
  try {
    // Validate dates
    const startDate = new Date(formulario.startDateTime)
    const endDate = new Date(formulario.endDateTime)
    
    if (endDate <= startDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio')
    }

    // Update listing availability
    await actualizarEstadoAnuncio(listingId, 'alquilado')

    // You could also create a rental request record here for tracking purposes
    // This would be useful for rental history
    
  } catch (error) {
    registrarError(error, 'RentalService:marcarAnuncioComoAlquilado')
    throw error
  }
}
