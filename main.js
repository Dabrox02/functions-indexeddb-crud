const indb = window.indexedDB;

const getData = async () => {
    let data = await (await fetch("data.json")).json();
    return data;
}

const openDB = (onSuccess, onError) => {
    let DBOpenReq = indb.open("videosCache", 1);

    DBOpenReq.addEventListener("error", (err) => {
        console.log("Error", err);
        if (onError) onError(err);
    })

    DBOpenReq.addEventListener("upgradeneeded", (ev) => {
        let db = ev.target.result;
        console.log("Upgrade", db);
        if (!db.objectStoreNames.contains("videosStore")) {
            db.createObjectStore("videosStore", {
                keyPath: "id"
            });
        }
    })

    DBOpenReq.addEventListener("success", (ev) => {
        let db = ev.target.result;
        console.log("Success", db);
        if (onSuccess) onSuccess(db);
    })
};

// Agregar Datos
openDB(async (db) => {
    let data = await getData();
    let { items } = data;

    const transaction = db.transaction(['videosStore'], 'readwrite');
    const objectStore = transaction.objectStore('videosStore');
    items.forEach(e => {
        const request = objectStore.add(e);
    });
}, (err) => {
    console.error("Error al abrir la base de datos:", err);
});

// Obtener Datos getAll
const getAll = () => {
    openDB(async (db) => {
        const transaction = db.transaction(["videosStore"], "readonly");
        const objectStore = transaction.objectStore("videosStore");
        const getRequest = objectStore.getAll();

        getRequest.onsuccess = (event) => {
            const datos = event.target.result;
            console.log("Datos obtenidos:", datos);
        };

        getRequest.onerror = (event) => {
            console.error("Error al obtener datos:", event.target.error);
        };

    }, (err) => {
        console.error("Error al abrir la base de datos:", err);
    });
}

// Obtener Datos con cursor 
const getCursor = () => {
    openDB(async (db) => {
        const transaction = db.transaction(["videosStore"], "readonly");
        const objectStore = transaction.objectStore("videosStore");
        const cursorRequest = objectStore.openCursor();

        console.log(cursorRequest);
        cursorRequest.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const datos = cursor.value;
                console.log("Datos obtenidos:", datos);
                cursor.continue();
            } else {
                console.log("No hay más datos en el almacén de objetos.");
            }
        };
        cursorRequest.onerror = (e) => {
            console.error("Error al abrir el cursor:", e.target.error);
        };
    }, (err) => {
        console.error("Error al abrir la base de datos:", err);
    });
}

// Obtener un solo Registro
const getOne = (id) => {
    openDB(async (db) => {
        const transaction = db.transaction(["videosStore"], "readonly");
        const objectStore = transaction.objectStore("videosStore");
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = (e) => {
            console.log(e.target.result);
        };
        getRequest.onerror = (e) => {
            console.error("Error al obtener el registro:", event.target.error);
        };
    }, (err) => {
        console.error("Error al abrir la base de datos:", err);
    });
}

// Actualizar Registro
const updateOne = (data) => {
    openDB(async (db) => {
        const transaction = db.transaction(["videosStore"], "readwrite");
        const objectStore = transaction.objectStore("videosStore");
        const getRequest = objectStore.put(data);

        getRequest.onsuccess = (e) => {
            console.log(e.target.readyState);
        };
        getRequest.onerror = (e) => {
            console.error("Error al obtener el registro:", event.target.error);
        };
    }, (err) => {
        console.error("Error al abrir la base de datos:", err);
    });
}

// Eliminar Registro
const deleteOne = (id) => {
    openDB(async (db) => {
        const transaction = db.transaction(["videosStore"], "readwrite");
        const objectStore = transaction.objectStore("videosStore");
        const getRequest = objectStore.delete(id);

        getRequest.onsuccess = (e) => {
            console.log(e.target.readyState);
        };
        getRequest.onerror = (e) => {
            console.error("Error al obtener el registro:", event.target.error);
        };
    }, (err) => {
        console.error("Error al abrir la base de datos:", err);
    });
}


// * Pruebas Funciones CRUD

// let newObject = {
//     "kind": "youtube#video",
//     "etag": "GQ53_ZC_qfffWiLgLyDHn2NC14Y",
//     "id": "iS51eq0wemg",
//     "snippet": {
//         "publishedAt": "2023-09-19T20:05:13Z",
//         "channelId": "UC3sznuotAs2ohg_U__Jzj_Q",
//         "title": "Film Theory: I Solved the FNAF Movie!",
//         "description": "Thanks to Google Meet for sponsoring a portion of this video!\nTry Google Meet ► https://goo.gle/3Rl9Opw\n\nOH boy, loyal theorist, it’s finally here: the Five Nights at Freddy’s movie! Ever since the first FNAF trailer dropped, we knew the lore would be different from the game and movie. But, HOW different? There are so many questions we have to answer: is this in the same universe? Where does this story take place? Are Chica, Fox, Bonnie, and Freddy all the same? And WHO is the real big bad? Let’s open the floodgates to Freddy Fazbear’s Pizzeria and SOLVE the FNAF movie…\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*🔽 Don’t Miss Out!*\nGet Your TheoryWear! ► https://theorywear.com/\nDive into the Reddit! ► https://www.reddit.com/r/GameTheorists/\n\nNeed Royalty Free Music for your Content? Try Epidemic Sound.\nGet Your 30 Day Free Trial Now ► http://share.epidemicsound.com/TheFilmTheorists\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*👀 Watch MORE Theories:*\nThe Hidden LORE of Skibidi Toilet ►► https://youtu.be/R7JZVn1iFy4\nBluey is DARKER Than You Realize! ►► https://youtu.be/pf6DcLlRaaw\nBeware the Living Flesh! ►► https://youtu.be/FuyNyn99NWs\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*Join Our Other YouTube Channels!*\n​🕹️ @GameTheory \n🍔 @FoodTheory \n👔 @StyleTheorists \n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*Credits:*\nWriters: Matthew Patrick and Forrest Lee\nEditors: Alex \"Sedge\" Sedgwick, Koen Verhagen, and Gerardo Andrés Mejía Torres\nSound Designer: Yosi Berman\nThumbnail Artist: DasGnomo\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n#FNAF #FiveNightsatFreddys #FNAFMovie #FNAFMovieTrailer #FNAFTrailer #FNAFLore #FNAFRuin #FNAFSecurityBreach #FNAFTheory #Theory #FilmTheory #Matpat #GooglePartner #GoogleMeet",
//         "thumbnails": {
//             "default": {
//                 "url": "https://i.ytimg.com/vi/iS51eq0wemg/default.jpg",
//                 "width": 120,
//                 "height": 90
//             },
//             "medium": {
//                 "url": "https://i.ytimg.com/vi/iS51eq0wemg/mqdefault.jpg",
//                 "width": 320,
//                 "height": 180
//             },
//             "high": {
//                 "url": "https://i.ytimg.com/vi/iS51eq0wemg/hqdefault.jpg",
//                 "width": 480,
//                 "height": 360
//             },
//             "standard": {
//                 "url": "https://i.ytimg.com/vi/iS51eq0wemg/sddefault.jpg",
//                 "width": 640,
//                 "height": 480
//             },
//             "maxres": {
//                 "url": "https://i.ytimg.com/vi/iS51eq0wemg/maxresdefault.jpg",
//                 "width": 1280,
//                 "height": 720
//             }
//         },
//         "channelTitle": "The Film Theorists",
//         "tags": [
//             "fnaf",
//             "five nights at freddy’s",
//             "five nights at freddys",
//             "fnaf movie trailer",
//             "fnaf trailer",
//             "fnaf lore",
//             "fnaf theory",
//             "fnaf timeline",
//             "fnaf song",
//             "security breach",
//             "fnaf security breach",
//             "fnaf ruin",
//             "ruin",
//             "fnaf ruin game",
//             "ruin lore",
//             "fnaf ruin theory",
//             "fnaf ruin mimic",
//             "film theory",
//             "film theorists",
//             "matpat",
//             "game theory",
//             "matpat game theory",
//             "matpat fnaf",
//             "game theory fnaf timeline",
//             "markiplier fnaf",
//             "meet",
//             "video call app",
//             "video calling app",
//             "google duo",
//             "google meet video call",
//             "meeting app"
//         ],
//         "categoryId": "1",
//         "liveBroadcastContent": "none",
//         "defaultLanguage": "en",
//         "localized": {
//             "title": "Film Theory: I Solved the FNAF Movie!",
//             "description": "Thanks to Google Meet for sponsoring a portion of this video!\nTry Google Meet ► https://goo.gle/3Rl9Opw\n\nOH boy, loyal theorist, it’s finally here: the Five Nights at Freddy’s movie! Ever since the first FNAF trailer dropped, we knew the lore would be different from the game and movie. But, HOW different? There are so many questions we have to answer: is this in the same universe? Where does this story take place? Are Chica, Fox, Bonnie, and Freddy all the same? And WHO is the real big bad? Let’s open the floodgates to Freddy Fazbear’s Pizzeria and SOLVE the FNAF movie…\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*🔽 Don’t Miss Out!*\nGet Your TheoryWear! ► https://theorywear.com/\nDive into the Reddit! ► https://www.reddit.com/r/GameTheorists/\n\nNeed Royalty Free Music for your Content? Try Epidemic Sound.\nGet Your 30 Day Free Trial Now ► http://share.epidemicsound.com/TheFilmTheorists\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*👀 Watch MORE Theories:*\nThe Hidden LORE of Skibidi Toilet ►► https://youtu.be/R7JZVn1iFy4\nBluey is DARKER Than You Realize! ►► https://youtu.be/pf6DcLlRaaw\nBeware the Living Flesh! ►► https://youtu.be/FuyNyn99NWs\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*Join Our Other YouTube Channels!*\n​🕹️ @GameTheory \n🍔 @FoodTheory \n👔 @StyleTheorists \n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n*Credits:*\nWriters: Matthew Patrick and Forrest Lee\nEditors: Alex \"Sedge\" Sedgwick, Koen Verhagen, and Gerardo Andrés Mejía Torres\nSound Designer: Yosi Berman\nThumbnail Artist: DasGnomo\n‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐‐\n#FNAF #FiveNightsatFreddys #FNAFMovie #FNAFMovieTrailer #FNAFTrailer #FNAFLore #FNAFRuin #FNAFSecurityBreach #FNAFTheory #Theory #FilmTheory #Matpat #GooglePartner #GoogleMeet"
//         },
//         "defaultAudioLanguage": "en"
//     },
//     "contentDetails": {
//         "duration": "PT19M11S",
//         "dimension": "2d",
//         "definition": "hd",
//         "caption": "true",
//         "licensedContent": true,
//         "contentRating": {},
//         "projection": "rectangular"
//     },
//     "statistics": {
//         "viewCount": "2024764",
//         "likeCount": "119003",
//         "favoriteCount": "0",
//         "commentCount": "8076"
//     }
// }
// updateOne(newObject);

// deleteOne("q3x9iUL-74w");