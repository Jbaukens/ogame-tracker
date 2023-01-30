import { LifeformDiscoveryEventArtifactFindingSize } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventArtifactFindingSize";
import { LifeformDiscoveryEventType } from "@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType";
import { LifeformDiscoveryMessages } from "./types";

export const hu: LifeformDiscoveryMessages = {
    [LifeformDiscoveryEventType.nothing]: [
        /*'Kutatásuk kezdetén */'sikerült megfejteniük néhány ígéretes koordinátát'/* , amelyeket egy titokzatos üzenetből nyertek ki. Ám amikor a Kutatóhajó elérte az említett koordináták által említett szektort, a legénység csak egy óriási törmelékmezőt talált, amely egy csata után maradt hátra. A túlélők utáni kutatás végül eredménytelen volt.'*/,
        /*'Egy */'mágneses aszteroidamező tönkretette a szkennereket'/* . Ami az intelligens földön kívüli élet ígéretes jelének tűnt, az csak egy zavar volt a mérőműszerekben, és nem találtak új életformákat.'*/,
        /*'Éppen akkor */'állt le hirtelen az összes kommunikációs rendszer'/* , amikor a Kutatóhajó befogott egy ígéretes rádiójelet. A körülményeket figyelembe véve nem csak az volt lehetetlen, hogy kapcsolatba lépjünk potenciális intelligens életformákkal, de a küldetés folytatása is veszélyes lett volna. Így a legénység csalódottan bár, de sértetlenül tért haza.'*/,
        /*'Egy valamilyen tudatossággal rendelkező ködöt */'fedeztek fel rendszerünk egy javarészt feltáratlan szegletében'/* ! Intergalaktikus küldötteink magukon kívül voltak, és komoly médiacirkusz alakult ki, amikor a szondát a felhőbe küldték. A köddel való kommunikációra tett kísérletek azonban hamarosan kiderítették, hogy annak intelligenciája valahol a csótányokéval van egy szinten. Az izgalom gyorsan alábbhagyott, és úgy döntöttek, az egész epizódot csendben a szőnyeg alá söprik.'*/,
        /*'Új életformák után kutatva a Kutatóhajó titokzatos jeleket követett, */'amelyek egy ismeretlen bolygó túloldaláról érkeztek'/* . A fedélzeten lévő intergalaktikus küldöttek már előkészítették az üdvözlőcsomagot és aktiválták a fordítókomputert, de kiderült, hogy a jel egy hajóroncsról érkezett. A hajó egyértelműen földönkívüli eredetű, de sajnos nyoma sem volt a legénységnek. Ez azt jelenti, hogy nem találtunk új életformát.'*/,
        /*'A Kutatóhajó már egy ideje úton volt, amikor kiderült, */'végzetes hiba csúszott a letapogató szoftverbe'/* . Ez sajnos azt jelenti, hogy nem lehetett új életformát találni.'*/,
        /*'Intergalaktikus küldötteink meglátogattak egy bolygót, */'ahol egy rendkívül tiszta, rovarszerű faj élt, feltételezve'/* , hogy intelligensek lehetnek, de csalódniuk kellett abban, amit találtak. Miután végignézték, ahogy a hajó hulladékpréselőjének tartalmát majszolják, úgy döntöttek, visszaviszik őket a bolygójukra, annak ellenére, hogy a legénység néhány tagja azt javasolta, tartsanak egy párat a fedélzeten.'*/,
        /*'A kutatóhajó fedélzetén lévő kutatók el voltak ragadtatva, amikor egy */'aszteroidamező közepén felfedeztek egy neurális hálózatot'/* . Ezért igencsak nagyot csalódtak, amikor kiderült, hogy ez nem más, mint évszázados sporteredményekről szóló, elcsípett híradások halmaza, amely saját életet élt, mint valami űrkanapé-szakértő. A legénység letörten tért vissza, anélkül, hogy bármi jelentősebbet megtudtak volna, mint hogy ki nyert utoljára valamilyen hamvakat vagy mit.'*/,
        /*'A kutatóhajó legénysége el volt ragadtatva, amikor a */'gombaspórákon végzett vizsgálatok eredményei arra utaltak'/* , intelligens életet találtak. Sajnos kiderült, valami tréfamester manipulálta a teszteredményeket, csak hogy kínos helyzetbe hozzon egy rivális kutatót. A spórák valójában nem voltak intelligensebbek, mint azok, amelyeket a konyhában a mikrohullámú sütő háta mögött találtak. A bajkeverőt felfüggesztették és kitették a legközelebbi bolygón, mielőtt a hajó hazatért volna.'*/,
        /*'Ígéretes jelek */'vezették a Kutatóhajót egy titokzatos aranygömbhöz'/* , amely magányosan lebegett az űr mélyén. A fedélzeten lévő intergalaktikus küldöttek minden erőfeszítésük ellenére sem tudtak bejáratot találni, vagy bármilyen kapcsolatot teremteni a furcsa tárggyal, mielőtt az hirtelen elugrott onnan.'*/,
        /*'Egy */'feltáratlan bolygón a kutatóhajó felfedezett egy növényrendszert'/* , amely sokkal intelligensebb volt, mint amilyennek elsőre tűnt. Amikor azonban a legénység megpróbált vizsgálódni, furcsa egyenruhás őrrobotok jelentek meg, és figyelmeztették őket, hogy a növények magántulajdonban vannak. Figyelmen kívül hagyva az intergalaktikus birtokháborítási törvények megszegésének lehetséges következményeit, a kutatók kitartottak, és a sötétség leple alatt egy titkos művelet során mintát vettek, majd gyorsan pályára álltak. Sajnos a művelet egy kicsit TÚLSÁGOSAN IS titkos volt egy csapat nagyokos számára, és a hajón derült ki, hogy a kockázatosan megszerzett minták nem mások, mint közönséges szobanövények.'*/,
        /*'A földönkívüli intelligencia után kutatva a kutatóhajó már hónapok óta eredménytelenül, céltalanul járta a galaxist, */'amikor végre felfedezték a papucsállatkák idegen megfelelőjét'/* ! Ugyan nem igazán felelt meg az intelligens élet kritériumainak, de a legénység annyi monoton hónapnyi keresés után úgy döntött, hogy ezt a mégoly értelmetlen élet felfedezését is sikernek tekinti, és minden említésre méltó hír nélkül tért haza.'*/,
        /*'A Kutatóhajó által követett rendkívül ígéretes jelek */'sajnálatos módon elvesztek a kozmikus ködben'/* . Még egy ideig folytatták a keresést, de sajnos nem találtak új életformákat.'*/,
        /*'A kutatóhajó legénysége intenzív kutatás után */'felfedezte az óriás amőbák egy fluoreszkáló faját'/* ! Sajnos az egysejtű organizmusoknak akadt némi problémájuk az általános intelligenciateszten való megfeleléssel. Tekintettel arra, hogy a kutatók milyen kevés figyelmet szentelnek az amőbáknak, nem meglepő módon ezt a felfedezést is hasonlóan jelentéktelennek minősítették.'*/,
        /*'Hipnotikus köd vette körül a Kutatóhajó teljes legénységét. Úgy tűnik, a furcsa színek és minták valahogy megzavarják az emberi agyat, ami azt jelentette, ahelyett, hogy földönkívüli élet után kutattak volna, a legénység inkább azzal foglalkozott, hogy megválaszolja a kérdést: "*/'Vajon az idegenek tényleg esznek zöld hot dogot'/* ?”. Mondanunk sem kell, nem találtak új életformát.'*/,
        /*'A földön kívüli élet után kutatva a */'Kutatóhajó egy kozmikus örvénybe került'/* , amely súlyosan megrongálta a külső burkolatot. A legénység és a hajó megmenekült egy kockázatos repülési manőver által, de fel kellett adniuk a kutatást, és üres kézzel kellett visszatérniük.'*/,
        /*'A kutatóhajó */'egy régi és elhagyatott űrállomásra bukkant'/* , amelyet egykor valami korábban ismeretlen faj lakott. Áthatóbb tanulmányozás után azonban hamarosan kiderült, hogy az állomás csupán egy kihalt életforma kifinomult átverése. A legénység megsemmisítette a gúnyos üzeneteket, de semmi mást nem tudtak felfedezni.'*/,
        /*'A legénység egy csúcstechnológiás, */'mesterséges intelligencia által vezérelt kutatóállomásra'/* bukkant egy magányos és elvadult bolygón. Sajnos a bejárat jelszóval volt védve, és az MI visszautasította az együttműködést. A legénység napokig próbálta megfejteni a jelszót, és a készletek kezdtek fogyni, amikor a legénység egyik jelentéktelen tagja rájött a kombinációra, és feltörte a kódot. Sajnos az állomás csalódásnak bizonyult, és a mesterséges intelligencia nem volt több, mint egy bonyolult otthonkezelő rendszer. A legénység a hazatérés mellett döntött.'*/,
        /*'A navigációs modul műszaki hibája miatt a */'kutatóhajó veszélyesen közel került egy fekete lyuk eseményhorizontjához'/* . A legénység még időben vissza tudott fordulni, de az üzemanyagkészletük végül kimerült, így sikertelenül meg kellett szakítaniuk az új életformák keresését.'*/,
        /*'A kutatóhajó izgatottan jelentette, */'hogy egy párhuzamos univerzumból származó'/* , azonos hajóval találkoztak. Az ebből a dimenzióból származó legénységnek még a neve is egyezett. De a hasonlóságok itt véget is értek: az üdvözlő partin a vendégek annyira modortalanok voltak, hogy a legénység hamarosan kiutasította őket az univerzumunkból. A legénység csalódottan, de mégis megkönnyebbülten tért haza.'*/,
    ],
    [LifeformDiscoveryEventType.lostShip]: [
        /*TODO: hu 'Die Crew des Erkundungsschiffes war erheblichen inneren Konflikten ausgesetzt, */'die schließlich zu einer Meuterei führten'/*. Die ausgesetzten Crewmitglieder konnten gefunden und geborgen werden, sie berichteten jedoch, dass die Gegenseite das Schiff übernommen und sich einer Bande von Raumpiraten angeschlossen hat. Als Konsequenz dieses Vorfalls wurden nun für alle Schiffsbesatzungen vierteljährliche Teambuilding-Seminare verordnet.'*/,
        /*'A kutatóhajó */'legénysége sikeresen kapcsolatba lépett egy eddig ismeretlen'/* idegen fajjal. Az első benyomások szerint jóindulatúak voltak. A küldöttünk és a legénység beszámolói azonban egyre euforikusabbak lettek, ezért azt kell feltételeznünk, hogy valamiféle hipnózisnak lettek kitéve. Az utolsó jelentés, amit kaptunk, egy örömteli nyilatkozat volt az egész legénység nevében, hogy inkább ezekkel a barátságos idegenekkel maradnának. A hajó és legénysége nyomtalanul eltűnt.'*/,
        /*TODO: hu 'Bei der Suche nach intelligenten Lebensformen legte das Schiff auf einem bisher unerforschten Mond eine Zwischenlandung ein. Es stellte sich schnell heraus, warum bisher niemand über ihn berichtete. Der Crew gelang es noch, einen Hilferuf auszusenden, aber leider zu spät. Die vom Landemanöver */'aufgescheuchten riesigen Magmawürmer verschlangen das Schiff'/* und seine gesamte Besatzung innerhalb von Minuten.'*/,
        /*'A kutatóhajónak sikerült egy */'intelligens idegen faj nyomára bukkannia, de kiderült'/* , hogy ellenségesek. A legénység által küldött utolsó jelek alapján úgy tűnik, hogy az idegenek foglyul ejtették őket. Minden további kísérlet a hajó és legénysége felkutatására kudarcot vallott.'*/,
        /*'A kutatóhajó útja során megállt egy ismeretlen bolygón, hogy feltöltse a készleteit. A bolygót különös köd borította, */'amit a legénység gyorsan altató gázként azonosított'/* . A további vizsgálat során azonban hamarosan kiderült, a gáz olyan erős volt, hogy mind a hajó, mind a legénysége menthetetlenné vált.'*/,
        /*'Ezen kutatóhajó legénysége már kiérdemelte magának a hírnevet, mint egy kissé csapongó, a vakmerőségig bátor csapat, ezért úgy tűnt, tökéletesen megfelelnek erre a küldetésre. Talán azt hitték, */'hogy egyenesen átrepülhetnek az aszteroidamezőn'/* ? Sajnos a választ nehéz megállapítani hajójuk roncsaiból.'*/,
        /*'Úgy tűnik, hogy a kutatóhajó */'odaveszett egy eddig ismeretlen szingularitásban'/* . A legénység azóta sem adott életjelet magáról.'*/,
        /*TODO: hu 'Die Erkundungsflotte */'geriet auf ihrer Mission in den Hinterhalt einer feindlichen Alienspezies'/*. Wir vermuten, dass sie intelligent ist, aber leider war sie auch höchst aggressiv und vernichtete das Erkundungsschiff, bevor ein Kontakt überhaupt zustande kommen konnte.'*/,
        /*'A kutatóhajó ígéretes jeleket észlelt. Amikor viszont megtalálták a jel forrását, hirtelen megszűnt az adás. */'Keresőcsapatokat küldtek ki, de nem találták'/* a hajó tartózkodási helyének nyomát. Bizonyára eltűnt a semmibe.'*/,
        /*TODO: hu 'Bei der Verfolgung starker kosmischer Signale war der Navigator offenbar so abgelenkt, dass er das in der */'Nähe befindliche schwarze Loch vollkommen aus den Augen'/* verlor. Das Schiff geriet in das Gravitationsfeld und alle Anstrengungen der Crew konnten nicht verhindern, dass es hineingesogen wurde. Um einen weiteren Verlust dieser Art zu vermeiden, wurde vorgeschlagen, automatische Warnsignale vor schwarzen Löchern als Standard zu integrieren.'*/
    ],
    [LifeformDiscoveryEventType.newLifeformFound]: /.+ lett felfedezve a .+ koordinátán és hozzá lett adva az Életformák menühöz/i,
    [LifeformDiscoveryEventType.knownLifeformFound]: /Követeink azonban (?<xp>\d+) XP-vel bővíthették a róluk gyűjtött ismereteinket/i,
    [LifeformDiscoveryEventType.artifacts]: {
        size: {
            [LifeformDiscoveryEventArtifactFindingSize.storageFull]: /*TODO: hu 'Das Erkundungsschiff hat zwar ein paar Artefakte gefunden, */'konnte sie aber nicht mitnehmen, da deine Lager voll sind',
            [LifeformDiscoveryEventArtifactFindingSize.small]: /*'A Kutatóhajó */'kis mennyiségű leletet talált',
            [LifeformDiscoveryEventArtifactFindingSize.medium]: /*'A Kutatóhajó */'nagy mennyiségű leletet talált',
            [LifeformDiscoveryEventArtifactFindingSize.large]: /*'A Kutatóhajó */'hatalmas leletegyüttest talált',
        },
        numberOfArtifacts: /Talált leletek: (?<artifacts>\d+)/i,
    },
};