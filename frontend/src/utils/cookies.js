export const setCookie = (name, value, days = 7) => {
    const date = new Date();

    date.setTime(date.setTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name) =>{
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim()
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length))
        }
    }
    return null;
}

export const deleteCookie = (name) =>{
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path/;`;
}

export const hasCookie = (name) =>{
    return getCookie(name) !== null;
}

