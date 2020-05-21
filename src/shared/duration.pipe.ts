const durationToString = (value: string) => {
    let duration = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, years, days, hours, mins, secs] = value.match(/PT(?:(\d+)Y)?(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (years) { duration += `${years}y `; }
    if (days) { duration += `${days}d `; }
    if (hours) { duration += `${hours}h `; }
    if (mins) { duration += `${mins}min `; }
    if (secs) { duration += `${secs}s`; }

    return duration;
};

export default durationToString;
