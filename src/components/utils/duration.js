const zeropad = number => ((`00${number}`).slice(-2));

const duration = (seconds) => {
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hrs = zeropad(Math.floor((seconds % (60 * 60 * 24)) / (60 * 60)));
    const min = zeropad(Math.floor((seconds % (60 * 60)) / 60));
    const sec = zeropad(Math.floor(seconds % (60)));

    return `${days ? `${days} d` : ''} ${hrs !== '00' ? `${hrs}:` : ''}${min}:${sec}`;
};

export default duration;
