if (!activity.startTime.trackTime || !activity.endTime?.trackTime)
 return '--h --m';



const shouldShowEmptyTime = (startTime, endTime) => {
    return (!startTime.trackTime || !endTime?.trackTime);
}


if (shouldShowEmptyTime(activity.startTime, activity.endTime)) {
 return '--h --m';
}



