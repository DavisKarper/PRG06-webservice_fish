import express from "express";
import Fish from "../Models/Fish.js";
import { faker } from "@faker-js/faker";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100
        const page = parseInt(req.query.page) || 1

        const skip = (page - 1) * limit
        const fishes = await Fish.find({}).skip(skip).limit(limit);

        const totalItems = await Fish.countDocuments();
        const totalPages = Math.ceil(totalItems / limit)
        res.status(200).json(
            {
                "items": fishes,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/fishes`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                },
                "pagination": {
                    "currentPage": page,
                    "currentItems": fishes.length,
                    "totalPages": totalPages,
                    "totalItems": totalItems,
                    "_links": {
                        "first": {
                            "page": 1,
                            "href": `${process.env.BASE_URL}/fishes?page=1&limit=${limit}`
                        },
                        "last": {
                            "page": totalPages,
                            "href": `${process.env.BASE_URL}/fishes?page=${totalPages}&limit=${limit}`
                        },
                        "previous": page > 1 ? {
                            "page": page - 1,
                            "href": `${process.env.BASE_URL}/fishes?page=${page - 1}&limit=${limit}`
                        } : null,
                        "next": page < totalPages ? {
                            "page": page + 1,
                            "href": `${process.env.BASE_URL}/fishes?page=${page + 1}&limit=${limit}`
                        } : null
                    }
                }
            })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    if (req.body.method === "SEED") {
        try {
            const amount = req.body.amount
            const reset = req.body.reset
            if (reset) {
                await Fish.deleteMany({})
            }

            const seederFishes = [
                {
                    "name": "Clownvis",
                    "scientificName": "Amphiprioninae",
                    "description": "De clownvis is een feloranje vis met witte strepen en leeft in symbiose met zeeanemonen.",
                    "funFacts": [
                        "Clownvissen kunnen van geslacht veranderen.",
                        "Ze zijn immuun voor het gif van zeeanemonen.",
                        "Ze communiceren door te klikken en knarsen."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg/1920px-Amphiprion_ocellaris_%28Clown_anemonefish%29_by_Nick_Hobgood.jpg",
                    "loc": {
                        "point": "Stille Oceaan",
                        "coordinates": [-14.5994, -28.6731]
                    }
                },
                {
                    "name": "Blauwe Doktersvis",
                    "scientificName": "Paracanthurus hepatus",
                    "description": "De blauwe doktersvis is een felblauwe vis met een opvallende gele staartvin.",
                    "funFacts": [
                        "Bekend van de film 'Finding Nemo'.",
                        "Kan een witachtige kleur krijgen bij stress.",
                        "Heeft scherpe stekels die als verdedigingsmechanisme dienen."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Atlantic_blue_tang_surgeonfish_%28%22Acanthurus_coeruleus%22%29_-13092009a.jpg/1920px-Atlantic_blue_tang_surgeonfish_%28%22Acanthurus_coeruleus%22%29_-13092009a.jpg",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-12.4500, 130.8500]
                    }
                },
                {
                    "name": "Witte Haai",
                    "scientificName": "Carcharodon carcharias",
                    "description": "De witte haai is een van de grootste roofvissen in de oceaan en staat bovenaan de voedselketen.",
                    "funFacts": [
                        "Kan prooien ruiken op kilometers afstand.",
                        "Heeft meerdere rijen tanden die steeds vervangen worden.",
                        "Kan sprongen maken boven het wateroppervlak."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg",
                    "loc": {
                        "point": "Atlantische Oceaan",
                        "coordinates": [34.0522, -77.3500]
                    }
                },
                {
                    "name": "Maanvis",
                    "scientificName": "Mola mola",
                    "description": "De maanvis is een van de zwaarste beenvissen ter wereld en heeft een unieke ronde vorm.",
                    "funFacts": [
                        "Kan tot 1000 kg wegen.",
                        "Wordt vaak geparasiteerd door zeeluis en kwallen.",
                        "Ligt soms op zijn zij aan het wateroppervlak om op te warmen."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Klompvis_14-05-2009_15-39-20.JPG/1920px-Klompvis_14-05-2009_15-39-20.JPG",
                    "loc": {
                        "point": "Middellandse Zee",
                        "coordinates": [36.8575, 14.2697]
                    }
                },
                {
                    "name": "Zeepaardje",
                    "scientificName": "Hippocampus",
                    "description": "Zeepaardjes zijn kleine vissen met een unieke opwaartse houding en een lange snuit.",
                    "funFacts": [
                        "Mannetjes dragen de baby's in een speciale buidel.",
                        "Ze hebben geen maag en moeten constant eten.",
                        "Kunnen van kleur veranderen om zich te camoufleren."
                    ],
                    "imageUrl": "https://a.storyblok.com/f/151320/6f058edd5e/aquazoo_braziliaans_zeepaardje.jpg",
                    "loc": {
                        "point": "Caribische Zee",
                        "coordinates": [18.4655, -66.1057]
                    }
                },
                {
                    "name": "Zeilvis",
                    "scientificName": "Istiophorus",
                    "description": "De zeilvis staat bekend om zijn snelheid en lange rugvin die lijkt op een zeil.",
                    "funFacts": [
                        "Kan snelheden bereiken tot 110 km/u.",
                        "Gebruikt zijn zeil om prooien te verzamelen.",
                        "Verandert van kleur tijdens de jacht."
                    ],
                    "imageUrl": "https://diertjevandedag.be/wp-content/uploads/2024/07/Atlantische-zeilvis-1.jpg",
                    "loc": {
                        "point": "Atlantische Oceaan",
                        "coordinates": [25.7617, -80.1918]
                    }
                },
                {
                    "name": "Blauwe Mandarijnpitvis",
                    "scientificName": "Synchiropus splendidus",
                    "description": "De blauwe mandarijnpitvis is een kleine, felgekleurde vis die vooral voorkomt in koraalriffen.",
                    "funFacts": [
                        "Heeft een slijmlaag die hem beschermt tegen parasieten.",
                        "Is een van de weinige vissen met felle blauwe pigmenten.",
                        "Komt alleen 's nachts uit zijn schuilplaats."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Synchiropus_splendidus_2_Luc_Viatour.jpg/1280px-Synchiropus_splendidus_2_Luc_Viatour.jpg",
                    "loc": {
                        "point": "Stille Oceaan",
                        "coordinates": [7.3192, 134.4559]
                    }
                },
                {
                    "name": "Lantaarnvis",
                    "scientificName": "Myctophidae",
                    "description": "Lantaarnvissen zijn kleine, diepzeevissen die lichtgevende organen gebruiken om te communiceren.",
                    "funFacts": [
                        "Ze produceren licht door bioluminescentie.",
                        "Zijn een van de meest talrijke vissoorten in de oceaan.",
                        "Migreren dagelijks van de diepzee naar het oppervlaktewater."
                    ],
                    "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDeXhaMLmldxZNtV2197Y5zRmZdS9AxpS1fSEJlFNkEVZWwVvnrYvzrEGHiv430XmCNDOEomqIxdDpcP35RcBag",
                    "loc": {
                        "point": "Diepzee, Grote Oceaan",
                        "coordinates": [-5.0000, -150.0000]
                    }
                },
                {
                    "name": "Stekelrog",
                    "scientificName": "Dasyatidae",
                    "description": "Stekelroggen zijn plat en hebben een lange staart met een giftige stekel als verdediging.",
                    "funFacts": [
                        "Zijn verwant aan haaien.",
                        "Kunnen elektrische velden detecteren om prooien te vinden.",
                        "De staartstekel kan dodelijk zijn voor roofdieren."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Raja_clavata_%28juv%29.jpg/1280px-Raja_clavata_%28juv%29.jpg",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-20.0000, 55.0000]
                    }
                },
                {
                    "name": "Piranha",
                    "scientificName": "Pygocentrus nattereri",
                    "description": "Piranha's staan bekend om hun scherpe tanden en sterke kaken.",
                    "funFacts": [
                        "Ze kunnen vlees binnen enkele minuten van een prooi afhalen.",
                        "Sommige soorten eten ook fruit en zaden.",
                        "Ze jagen meestal in groepen."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Piranha_fish.jpg/1920px-Piranha_fish.jpg",
                    "loc": {
                        "point": "Amazone",
                        "coordinates": [-3.4653, -62.2159]
                    }
                },
                {
                    "name": "Zwaardvis",
                    "scientificName": "Xiphias gladius",
                    "description": "De zwaardvis is een snelle roofvis met een kenmerkende lange snuit.",
                    "funFacts": [
                        "Kan snelheden tot 60 km/u halen.",
                        "Wordt vaak verward met de zeilvis.",
                        "Gebruikt zijn 'zwaard' om prooien te verdoven."
                    ],
                    "imageUrl": "https://duikeninbeeld.tv/wp-content/uploads/2016/07/zwaardvis.png",
                    "loc": {
                        "point": "Middellandse Zee",
                        "coordinates": [35.8997, 14.5146]
                    }
                },
                {
                    "name": "Koraalduivel",
                    "scientificName": "Pterois",
                    "description": "De koraalduivel is een prachtige maar giftige vis met lange stekels.",
                    "funFacts": [
                        "Hun stekels bevatten gif.",
                        "Zijn een invasieve soort in sommige gebieden.",
                        "Hebben een opvallend rood-wit gestreept patroon."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pterois_volitans_Manado-e.jpg/1280px-Pterois_volitans_Manado-e.jpg",
                    "loc": {
                        "point": "Rode Zee",
                        "coordinates": [20.5937, 39.7880]
                    }
                },
                {
                    "name": "Reuzenmanta",
                    "scientificName": "Manta birostris",
                    "description": "De reuzenmanta is een grote, vliegende rog die bekend staat om zijn indrukwekkende vleugels en zijn vermogen om door het water te glijden.",
                    "funFacts": [
                        "Kan een spanwijdte van 7 meter bereiken.",
                        "Voedt zich met plankton en kleine visjes.",
                        "Ze maken vaak acrobatische sprongen uit het water."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/06/Manta_ray_from_Yap.jpg",
                    "loc": {
                        "point": "Stille Oceaan",
                        "coordinates": [-5.0000, -90.0000]
                    }
                },
                {
                    "name": "Harnasmeerval",
                    "scientificName": "Loricariidae",
                    "description": "Harnasmeervallen zijn bekend voor hun schubachtige huid en het vermogen om zich vast te hechten aan rotsen met hun sterke zuigmond.",
                    "funFacts": [
                        "Ze kunnen goed in zuurstofarm water overleven.",
                        "De meeste soorten zijn nachtdieren.",
                        "Hun mond is aangepast om algen van rotsen te eten."
                    ],
                    "imageUrl": "https://www.aquainfo.nl/wp-content/uploads/2019/02/Hypostomus-plecostomus.jpg",
                    "loc": {
                        "point": "Amazonerivier",
                        "coordinates": [-2.0000, -59.5000]
                    }
                },
                {
                    "name": "Maanvis",
                    "scientificName": "Pterophyllum scalare",
                    "description": "De maanvis is een sierlijke vis die bekend staat om zijn lange, puntige vinnen en zijn kleurrijke uiterlijk.",
                    "funFacts": [
                        "Ze kunnen tot wel 6 jaar oud worden in gevangenschap.",
                        "Angelfish zijn monogaam en kiezen vaak een levenslange partner.",
                        "Ze kunnen tot 15 cm groot worden."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Freshwater_angelfish_biodome.jpg",
                    "loc": {
                        "point": "Amazonerivier",
                        "coordinates": [-3.4653, -60.0000]
                    }
                },
                {
                    "name": "Zilverpunthaai",
                    "scientificName": "Carcharhinus albimarginatus",
                    "description": "De zilverpunthaai is een grote, agressieve haai die bekend staat om zijn snelle zwembewegingen en scherpe tanden.",
                    "funFacts": [
                        "Ze jagen vaak in groepen.",
                        "Zilverhaaien hebben een uitgebreide migratieroute.",
                        "Ze voeden zich met vis, kreeftachtigen en andere kleine zeedieren."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Silvertip_shark.jpg/1920px-Silvertip_shark.jpg",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-10.0000, 105.0000]
                    }
                },
                {
                    "name": "Snoekbaars",
                    "scientificName": "Sander lucioperca",
                    "description": "De snoekbaars is een roofvis die vaak voorkomt in zoetwatermeren en rivieren, bekend om zijn scherpe tanden en snelheid.",
                    "funFacts": [
                        "Kan snelheden van 30 km/u bereiken.",
                        "Ze hebben een uitstekende gezichtsvermogen.",
                        "Snoekbaarzen kunnen grote prooien verslinden."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/StizostedionLuciopercaAquarium.JPG/1280px-StizostedionLuciopercaAquarium.JPG",
                    "loc": {
                        "point": "Meren van Europa",
                        "coordinates": [50.8503, 4.3517]
                    }
                },
                {
                    "name": "Goudvis",
                    "scientificName": "Carassius auratus",
                    "description": "De goudvis is een populaire aquariumvis, beroemd om zijn glanzende gouden schubben.",
                    "funFacts": [
                        "Ze kunnen tot wel 30 cm groot worden.",
                        "Gouden karpers zijn verwant aan de koi.",
                        "Ze hebben een uitstekend geheugen en kunnen hun eigenaar herkennen."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Goldfish3.jpg",
                    "loc": {
                        "point": "Azië, Zoetwatermeren",
                        "coordinates": [35.6762, 139.6503]
                    }
                },
                {
                    "name": "Papegaaivis",
                    "scientificName": "Scarus",
                    "description": "De papegaaivis heeft een opvallend, papegaai-achtig bekkie dat hij gebruikt om koraal af te breken.",
                    "funFacts": [
                        "Ze kunnen van kleur veranderen naargelang hun humeur.",
                        "Papegaaivissen eten vaak koraal en helpen zo bij het onderhouden van gezonde koraalriffen.",
                        "Ze hebben een sterke, beitelachtige bek."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Papegaaivis.JPG/1024px-Papegaaivis.JPG",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-13.2000, 130.8000]
                    }
                },
                {
                    "name": "Gewone Dolfijn",
                    "scientificName": "Delphinus delphis",
                    "description": "De gewone dolfijn is een zeezoogdier die beroemd is om zijn speelse gedrag en acrobatische sprongen.",
                    "funFacts": [
                        "Ze leven vaak in groepen van tientallen tot honderden.",
                        "Ze communiceren met een reeks klikken en fluittonen.",
                        "Ze zijn erg intelligent en kunnen complexe taken leren."
                    ],
                    "imageUrl": "https://inaturalist-open-data.s3.amazonaws.com/photos/158954338/original.jpg",
                    "loc": {
                        "point": "Atlantische Oceaan",
                        "coordinates": [24.3963, -81.3704]
                    }
                },
                {
                    "name": "Kleine lantaarnvis",
                    "scientificName": "Photoblepharon palpebratum",
                    "description": "Kleine lantaarnvissen gebruiken hun lichtgevende organen om te communiceren en te jagen in het donker.",
                    "funFacts": [
                        "Ze hebben een bioluminescente eigenschap.",
                        "Ze gebruiken het licht om prooien aan te trekken en roofdieren af te schrikken.",
                        "Kleine lantaarnvissen zijn nachtdieren."
                    ],
                    "imageUrl": "https://reefbuilders.com/wp-content/blogs.dir/1/files/photoblepharon-palpebratus/screen-shot-2013-07-06-at-7-37-30-pm.png",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [6.0000, 80.0000]
                    }
                },
                {
                    "name": "Snoek",
                    "scientificName": "Esox lucius",
                    "description": "De snoek is een krachtige zoetwatervis, beroemd om zijn snelheid en scherpe tanden.",
                    "funFacts": [
                        "Snoeken kunnen snelheden tot 20 km/u bereiken.",
                        "Ze jagen voornamelijk op vis en kleine zoogdieren.",
                        "Ze kunnen tot 1,5 meter lang worden."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Esox_hdm.JPG",
                    "loc": {
                        "point": "Noord-Amerika, Europa",
                        "coordinates": [52.3792, 4.9008]
                    }
                },
                {
                    "name": "Grote Rafelvis",
                    "scientificName": "Phycodurus eques",
                    "description": "De grote rafelvis is een meester in camouflage en lijkt op een onderwater plant.",
                    "funFacts": [
                        "De grote rafelvis is familie van het zeepaardje.",
                        "Ze gebruiken hun vinnen om zich langzaam voort te bewegen.",
                        "Ze hebben geen schubben, maar een soort harde plakken die eruit zien als bladeren."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Leafy_Sea_Dragon.jpg/1920px-Leafy_Sea_Dragon.jpg",
                    "loc": {
                        "point": "Australië, Zuid-Australië",
                        "coordinates": [-34.9285, 138.6007]
                    }
                },
                {
                    "name": "Nemo Tang",
                    "scientificName": "Acanthurus nigricans",
                    "description": "De nemo tang is een prachtige vis met een felblauw lichaam en zwarte vinnen, vaak gezien in koraalriffen.",
                    "funFacts": [
                        "Ze hebben scherpe stekels aan hun staart om zichzelf te verdedigen.",
                        "Nemo tangs leven in scholen en helpen het koraal te beschermen.",
                        "Ze worden vaak gevonden in tropische wateren."
                    ],
                    "imageUrl": "https://shop.dejongmarinelife.nl/media/catalog/product/cache/256814665417d31a06451205e2bc322a/a/c/acanthurus_nigricans.jpg",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-13.2000, 130.8000]
                    }
                },
                {
                    "name": "Stekelige Kreeft",
                    "scientificName": "Panulirus argus",
                    "description": "De stekelige kreeft heeft een ruwe schil en een lange, dunne scharen die het beschermen tegen roofdieren.",
                    "funFacts": [
                        "Ze gebruiken hun scharen om voedsel te vangen en zich te verdedigen.",
                        "Stekelige kreeften kunnen zich goed verbergen in rotsen en koraal.",
                        "Ze zijn nachtactief en voeden zich met vis en andere zeedieren."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Panulirus_argus.jpg/1280px-Panulirus_argus.jpg",
                    "loc": {
                        "point": "Caribische Zee",
                        "coordinates": [18.4655, -66.1057]
                    }
                },
                {
                    "name": "Grote Blauwring-octopus",
                    "scientificName": "Hapalochlaena lunulata",
                    "description": "De grote blauwring-octopus is beroemd om zijn felle blauwe kleur en zijn krachtige gif.",
                    "funFacts": [
                        "Grote blauwring-octopussen kunnen snel van kleur veranderen.",
                        "Hun gif is dodelijk voor mensen, maar ze bijten zelden.",
                        "Ze jagen op kleine vissen en schaaldieren."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Blue-Ringed_Octopus_%2814280614299%29.jpg/1920px-Blue-Ringed_Octopus_%2814280614299%29.jpg",
                    "loc": {
                        "point": "Indische Oceaan",
                        "coordinates": [-20.0000, 140.0000]
                    }
                },
                {
                    "name": "Witpuntrifhaai",
                    "scientificName": "Triaenodon obesus",
                    "description": "De witpuntrifhaai is een kleinere haai die vaak voorkomt in ondiepe wateren rond koraalriffen.",
                    "funFacts": [
                        "Ze leven vaak in groepen en jagen gezamenlijk.",
                        "Witpuntrifhaaien voeden zich met kleinere vissoorten.",
                        "Ze zijn 's nachts actiever."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Whitetip_reef_shark.JPG",
                    "loc": {
                        "point": "Indische Oceaan, Stille Oceaan",
                        "coordinates": [-5.0000, 100.0000]
                    }
                },
                {
                    "name": "Samengedrukte Zeeslang",
                    "scientificName": "Hydrophis platurus",
                    "description": "De samengedrukte zeeslang is een zeeslang die vaak voorkomt in ondiepe, tropische wateren en heeft een uniek lichaamsontwerp.",
                    "funFacts": [
                        "Samengedrukte zeeslangen kunnen tot wel 3 meter lang worden.",
                        "Ze hebben giftige beten, maar zijn over het algemeen niet agressief.",
                        "Samengedrukte zeeslangen kunnen zowel onder water als boven water ademen."
                    ],
                    "imageUrl": "https://calphotos.berkeley.edu/imgs/512x768/0000_0000/1206/0638.jpeg",
                    "loc": {
                        "point": "Indische Oceaan, Stille Oceaan",
                        "coordinates": [-10.0000, 110.0000]
                    }
                },
                {
                    "name": "Napoleonvis",
                    "scientificName": "Cheilinus undulatus",
                    "description": "De Napoleonvis is een grote vis met een karakteristieke hobbel op zijn voorhoofd, die voornamelijk voorkomt in tropische riffen.",
                    "funFacts": [
                        "Napoleonvissen kunnen meer dan 2 meter lang worden.",
                        "Ze zijn een van de grootste vissen die in koraalriffen leven.",
                        "De hobbel op hun voorhoofd wordt groter naarmate ze ouder worden."
                    ],
                    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/92/Cheilinus_undulatus_by_Patryk_Krzyzak.jpg",
                    "loc": {
                        "point": "Indische Oceaan, Stille Oceaan",
                        "coordinates": [-20.0000, 147.0000]
                    }
                },
                {
                    "name": "Vuurgarnaal",
                    "scientificName": "Neocaridina davidi",
                    "description": "De vuurgarnaal is een kleine, kleurrijke garnaal dat vaak voorkomt in tropische aquaria.",
                    "funFacts": [
                        "Deze garnaa; is een van de kleinste in de zee, meestal niet groter dan 2 cm.",
                        "Ze zijn vaak te vinden in de buurt van koraal en rotsen.",
                        "Vuurgarnalen kunnen van kleur veranderen afhankelijk van hun omgeving."
                    ],
                    "imageUrl": "https://aquainfo.nl/wp-content/uploads/2017/06/Neocaridina-heteropoda-Vuurgarnaal.jpg",
                    "loc": {
                        "point": "Zuid-China Zee",
                        "coordinates": [22.5431, 114.0579]
                    }
                },
            ]

            for (let i = 0; i < amount; i++) {
                if (i > 29) {
                    Fish.create({
                        name: faker.animal.fish(),
                        scientificName: faker.lorem.words(2),
                        description: faker.lorem.lines(3),
                        funFacts: [
                            faker.lorem.lines(1),
                            faker.lorem.lines(1),
                            faker.lorem.lines(1)
                        ],
                        imageUrl: "https://www.nwf.org/-/media/NEW-WEBSITE/Shared-Folder/Wildlife/Fish/fish-placeholder.jpg",
                        loc: {
                            point: faker.location.timeZone(),
                            coordinates: [
                                faker.location.latitude(),
                                faker.location.longitude()
                            ]
                        }
                    })
                } else {
                    Fish.create(seederFishes[i])
                }
            }
            res.status(200).json({ message: `Er staan nu ${amount} vissen in de database en de database is ${reset ? '' : 'niet '}gereset.` })
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        try {
            const { name, scientificName, description, funFacts, imageUrl, location } = req.body
            const fish = await Fish.create({
                name: name,
                scientificName: scientificName,
                description: description,
                funFacts: funFacts,
                imageUrl: imageUrl,
                loc: {
                    point: location,
                    coordinates: [
                        faker.location.latitude(),
                        faker.location.longitude()
                    ]
                }
            })
            res.status(201).json(fish)
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    res.status(204).send();
})

router.get('/:id', async (req, res) => {
    try {
        const fishId = req.params.id;
        const fish = await Fish.findById(fishId);

        if (!fish) {
            return res.status(404).json({ error: "fish not found" })
        }

        res.status(200).send(fish)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const fishId = req.params.id
        const { name, scientificName, description, funFacts, imageUrl } = req.body

        const fish = await Fish.findByIdAndUpdate(
            fishId,
            {
                name: name,
                scientificName: scientificName,
                description: description,
                funFacts: funFacts,
                imageUrl: imageUrl,
            },
            { new: true, runValidators: true });

        res.status(200).json(fish)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const fishId = req.params.id
        const fish = await Fish.findByIdAndDelete(fishId);
        if (!fish) {
            return res.status(404).json({ error: "fish not found" })
        }
        res.status(204).json(fish)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.options('/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.status(204).end();
});

export default router