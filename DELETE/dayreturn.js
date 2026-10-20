function monthday(day){

    const now = new Date();

    const dayback = 10 - day;

    now.setDate(now.getDate() - dayback);

    return {
        month: now.getMonth() + 1,
        date: now.getDate()
    };
}