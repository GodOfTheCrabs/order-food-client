/* eslint-disable */ 
export function initGoogleAuth(clientId) {
    return new Promise((resolve, reject) => {
        if (typeof google === "undefined" || typeof google.accounts === "undefined") {
            reject(new Error("Google API не загружен. Проверьте подключение скрипта в index.html."));
            return;
        }

        google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => resolve(response), 
        });
    });
}

export async function googleSignIn() {
    try {

        return new Promise((resolve, reject) => {
            google.accounts.id.initialize({
                client_id: "515637859526-d7fnov8pc67sr02bcf6p0es2720lldkc.apps.googleusercontent.com",
                callback: (response) => {
                    const idToken = response.credential; 
                    if (idToken) {
                        resolve(idToken);
                    } else {
                        reject("Ошибка входа через Google");
                    }
                }
            });

            google.accounts.id.prompt();
        });
    } catch (error) {
        console.error("Ошибка при входе через Google:", error);
        throw error;
    }
}