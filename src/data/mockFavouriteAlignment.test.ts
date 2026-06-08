import { describe, expect, it } from "vitest";
import { mockFights } from "./mock";
import type { FavouriteLevel, FavouriteSide } from "@/types";

/**
 * Expected PickFist favourite fields derived from June 7 odds screenshots.
 * Fighter A = first-listed fighter (matches mock fighter_a).
 * heavy_favourite when market favourite price <= -1000; else favourite.
 */
const MARKET_ALIGNED: Record<
  string,
  { favourite_side: FavouriteSide; favourite_level: FavouriteLevel }
> = {
  // Steel City — rows on boxing odds sheet
  "fight-001": { favourite_side: "fighterA", favourite_level: "favourite" }, // Padley -333
  "fight-002": { favourite_side: "fighterB", favourite_level: "favourite" }, // Sulaimaan -670
  "fight-003": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bowen -400
  "fight-004": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Atang -8000
  "fight-006": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Mitchell vs Carrasco -8000
  // Steel City — Tapology / proboxingodds (not on June 7 screenshot)
  "fight-005": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Maca ~-8000
  "fight-007": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Hardy vs Bacchini ~-5000
  "fight-008": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Mulunda -10000
  // UFC — all 12 bouts on sheet
  "fight-009": { favourite_side: "fighterA", favourite_level: "favourite" }, // Belal -120
  "fight-010": { favourite_side: "fighterA", favourite_level: "favourite" }, // Allen -205
  "fight-011": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ziam -310
  "fight-012": { favourite_side: "fighterA", favourite_level: "favourite" }, // Mitchell -135
  "fight-013": { favourite_side: "fighterA", favourite_level: "favourite" }, // Baraniewski -350
  "fight-014": { favourite_side: "fighterB", favourite_level: "favourite" }, // Costa -600
  "fight-015": { favourite_side: "fighterA", favourite_level: "favourite" }, // McGhee -450
  "fight-016": { favourite_side: "fighterA", favourite_level: "favourite" }, // Silva -125
  "fight-017": { favourite_side: "fighterB", favourite_level: "favourite" }, // Chandler -115
  "fight-018": { favourite_side: "fighterB", favourite_level: "favourite" }, // Brito -190
  "fight-019": { favourite_side: "fighterA", favourite_level: "favourite" }, // Chaves -370
  "fight-020": { favourite_side: "fighterA", favourite_level: "favourite" }, // Souza -300
  // Zuffa Boxing 7 — Bet365 / OddsChecker main; BoxRec rank proxy on undercard
  "fight-021": { favourite_side: "fighterA", favourite_level: "favourite" }, // CBS -330
  "fight-022": { favourite_side: "fighterA", favourite_level: "favourite" }, // Massey #21 vs Clarke #24
  "fight-023": { favourite_side: "none", favourite_level: "even" }, // both unranked
  "fight-024": { favourite_side: "fighterB", favourite_level: "favourite" }, // Streeter #365; McKenna unranked
  "fight-025": { favourite_side: "fighterA", favourite_level: "favourite" }, // Hickey #318 vs Tompkins #614
  "fight-026": { favourite_side: "fighterB", favourite_level: "heavy_favourite" }, // Dychko #69 vs Dykes #261
  "fight-027": { favourite_side: "fighterB", favourite_level: "favourite" }, // Vergiev #418 vs Hughes #516
  "fight-028": { favourite_side: "fighterA", favourite_level: "favourite" }, // Macmillan #814 vs Fanthome #1529
  // Misfits 23 — Fury vs. Hall (13 Jun 2026, MF-pro card)
  "fight-029": { favourite_side: "fighterA", favourite_level: "favourite" }, // Tommy Fury ~-350 vs Hall
  "fight-030": { favourite_side: "fighterA", favourite_level: "favourite" }, // Taylor 4-3 vs Floyd debut
  "fight-031": { favourite_side: "fighterB", favourite_level: "favourite" }, // Davis 1-2 vs Scott 1-4
  "fight-032": { favourite_side: "fighterB", favourite_level: "favourite" }, // Boateng 1-0 vs Cox debut
  "fight-033": { favourite_side: "none", favourite_level: "even" }, // Kay vs McCann — both debut
  "fight-034": { favourite_side: "fighterA", favourite_level: "favourite" }, // Jade Jones 1-0 vs Riccio debut
  "fight-035": { favourite_side: "fighterA", favourite_level: "favourite" }, // Brooks 2-1 vs Pardesi 1-0
  "fight-036": { favourite_side: "fighterA", favourite_level: "favourite" }, // Del Busso 1-1 vs Nguyen debut
  "fight-037": { favourite_side: "none", favourite_level: "even" }, // Bathory vs Flanagan — both debut
  "fight-038": { favourite_side: "none", favourite_level: "even" }, // El-Madani vs Nevin — both debut
  // York Hall — Hawley vs. Steward (13 Jun 2026)
  "fight-039": { favourite_side: "fighterA", favourite_level: "favourite" }, // Hawley 13-0 #218 vs Steward 12-1
  "fight-040": { favourite_side: "fighterA", favourite_level: "favourite" }, // Jashari 8-0 #175 vs Mason 6-4-1
  "fight-041": { favourite_side: "fighterA", favourite_level: "favourite" }, // Gardner 12-2 vs Butler 7-0
  "fight-042": { favourite_side: "fighterB", favourite_level: "favourite" }, // Kayani 12-1 vs Butt 5-0
  "fight-043": { favourite_side: "fighterA", favourite_level: "favourite" }, // Brandon 5-1 vs Gardiner 1-0
  "fight-044": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Gaskin 9-1 vs Chapman 13-75-10
  "fight-045": { favourite_side: "fighterA", favourite_level: "favourite" }, // Mehmood 2-0 vs Tananta 5-9
  "fight-046": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Ali 8-0 vs Meanwell 2-41-1
  "fight-047": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Ketteringham 2-0 vs Naeem Ali 3-154-1
  // Rodriguez vs. Vargas — Matchroom, Desert Diamond Arena (13 Jun 2026)
  "fight-048": { favourite_side: "fighterB", favourite_level: "favourite" }, // Rodriguez 23-0 #12 vs Vargas 19-1-1
  "fight-049": { favourite_side: "fighterA", favourite_level: "favourite" }, // Cardenas 17-0-2 #22 vs Martinez 16-0-1
  "fight-050": { favourite_side: "fighterB", favourite_level: "favourite" }, // Terraza 13-0 vs Adrian Rodriguez 10-0
  "fight-051": { favourite_side: "fighterA", favourite_level: "favourite" }, // Turhan 13-0 #2 vs Tellez 7-0
  "fight-052": { favourite_side: "fighterA", favourite_level: "favourite" }, // Alvarez 6-0 vs Stankovic 9-3
  "fight-053": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ochoa 21-1 vs Perez Hernandez 12-4-1
  "fight-054": { favourite_side: "fighterA", favourite_level: "favourite" }, // Beltran 7-0 vs Felicia 3-1
  "fight-055": { favourite_side: "fighterA", favourite_level: "favourite" }, // Esquivel 5-0 vs Taylor 1-1-1
  // MVPW-04 — Most Valuable Promotions, Caribe Royale Orlando (13 Jun 2026)
  "fight-056": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bermudez 22-1-1 champ vs Osorio 14-1-0
  "fight-057": { favourite_side: "fighterA", favourite_level: "favourite" }, // Artiga #4 15-0-1 vs Delgado 20-7-2
  "fight-058": { favourite_side: "fighterA", favourite_level: "favourite" }, // Brown #2 20-0-0 vs Rapp 8-0-1
  "fight-059": { favourite_side: "fighterA", favourite_level: "favourite" }, // Jones #2 9-0-0 vs Carranza 11-2-0
  "fight-060": { favourite_side: "fighterA", favourite_level: "favourite" }, // Hernandez #30 16-0-0 vs Diaz 16-7-1
  "fight-061": { favourite_side: "fighterB", favourite_level: "favourite" }, // Gomez #18 10-1-0 vs Sims 9-3-0
  "fight-062": { favourite_side: "fighterA", favourite_level: "favourite" }, // Cruz #7 11-0-0 vs Gutierrez 8-3-1
  "fight-063": { favourite_side: "fighterA", favourite_level: "favourite" }, // Veitia 7-0-1 vs Afolabi 6-0-0
  "fight-064": { favourite_side: "fighterB", favourite_level: "favourite" }, // Gruszewski 5-1-1 vs Marley 1-0-0
  "fight-065": { favourite_side: "fighterB", favourite_level: "heavy_favourite" }, // Felix 7-3-0 vs Brown-El debut
  "fight-066": { favourite_side: "fighterA", favourite_level: "favourite" }, // Addison 1-0-0 vs Davis debut
  "fight-067": { favourite_side: "none", favourite_level: "even" }, // De Oliveira vs Medina — both debut
  // Gonzalez vs. Perez — Salita Promotions, Grand Rapids (14 Jun 2026)
  "fight-068": { favourite_side: "fighterA", favourite_level: "favourite" }, // Gonzalez 29-4-1 #10 vs Perez 14-0 #11
  "fight-069": { favourite_side: "fighterA", favourite_level: "favourite" }, // Pagan #34 15-0-0 vs Salazar 23-1-1
  "fight-070": { favourite_side: "fighterA", favourite_level: "favourite" }, // Isley #27 15-0-0 vs Di Stefano 17-7-0
  "fight-071": { favourite_side: "fighterA", favourite_level: "favourite" }, // Moore #60 19-1-0 vs Haynesworth 19-10-1
  "fight-072": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Jennings 26-4-0 vs Simms 12-6-1
  "fight-073": { favourite_side: "fighterA", favourite_level: "favourite" }, // McElroy 6-0-0 vs Munoz 4-2-0
  "fight-074": { favourite_side: "fighterA", favourite_level: "favourite" }, // Simmons 8-0-0 vs Burns 8-4-0
  "fight-075": { favourite_side: "fighterA", favourite_level: "favourite" }, // Smith 6-0-0 vs Pallares 2-0-2
  // Pugilist Revolution — MF Pro, Thunder Studios Long Beach (19 Jun 2026)
  "fight-076": { favourite_side: "fighterA", favourite_level: "favourite" }, // Sylve #88 13-1-0 vs Diaz 34-9-1
  "fight-077": { favourite_side: "fighterB", favourite_level: "favourite" }, // Cushing #121 18-0-0 vs Ingram 9-0-0
  "fight-078": { favourite_side: "fighterA", favourite_level: "favourite" }, // Anderson #110 7-0-0 vs Sylvain 9-0-1
  "fight-079": { favourite_side: "fighterA", favourite_level: "favourite" }, // Lopez #158 8-0-0 vs Borrero 12-2-0
  "fight-080": { favourite_side: "none", favourite_level: "even" }, // Gomez vs Creer — both debut
  // Garner vs. Magnesi — Queensberry, St Mary's Stadium Southampton (20 Jun 2026)
  "fight-081": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Garner 19-0 #12 ~-630 vs Magnesi 26-2
  "fight-082": { favourite_side: "fighterA", favourite_level: "favourite" }, // Pauls #42 21-2-1 vs Goldsmith 15-1-0
  "fight-083": { favourite_side: "fighterB", favourite_level: "favourite" }, // Arthur #33 25-3-0 vs Edmondson 11-1-0
  "fight-084": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bevan #72 8-0-0 vs Lewicki 12-3-3
  "fight-085": { favourite_side: "fighterA", favourite_level: "favourite" }, // Guruli 3-0-0 vs Dillon 16-5-1
  // Quarless vs. McDonald — VIP Boxing, Olympia Liverpool (20 Jun 2026)
  "fight-086": { favourite_side: "fighterB", favourite_level: "favourite" }, // McDonald #150 10-1-0 vs Quarless 14-3-0
  "fight-087": { favourite_side: "fighterB", favourite_level: "favourite" }, // Shahid #376 5-3-2 vs Dwyer 3-5-1
  "fight-088": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Dube 5-0-0 vs Tananta 5-9-0
  "fight-089": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Welsh 5-0-0 vs Meanwell 2-41-1
  "fight-090": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Dickens 11-1-0 vs Sovtus 5-51-1
  "fight-091": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Jones 1-0-0 vs Pollard 1-109-0
  // Bibby vs. Walsh — St Andrew's Sporting Club, Glasgow (20 Jun 2026)
  "fight-092": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bibby #446 12-1-0 vs Walsh 9-0-0
  "fight-093": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Welsh 7-0-0 vs Sanchez 3-26-1
  "fight-094": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Porter 3-0-0 vs Vysniauskas 3-30-0
  "fight-095": { favourite_side: "fighterB", favourite_level: "favourite" }, // Dennis #536 21-20-0 vs Johnstone 2-0-0
  "fight-096": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Laing 3-0-0 vs Grannum 15-186-0
  // Davey vs. Thompson — Mark Bateson Promotions, Batley Bulldogs Stadium (20 Jun 2026)
  "fight-097": { favourite_side: "fighterB", favourite_level: "favourite" }, // Thompson #395 8-0-0 vs Davey 10-2-1
  "fight-098": { favourite_side: "fighterA", favourite_level: "favourite" }, // Marshall #628 8-0-0 vs Edgecumbe 3-0-1
  "fight-099": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Shepherd 9-2-0 vs Hardy 5-45-1
  "fight-100": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Ben Thompson 3-0-0 vs Arrowsmith 6-156-5
  "fight-101": { favourite_side: "fighterB", favourite_level: "favourite" }, // Kirk 0-29-2 vs Khan debut
  "fight-102": { favourite_side: "fighterB", favourite_level: "heavy_favourite" }, // Cook 1-64-3 vs Bridges debut
  "fight-103": { favourite_side: "fighterB", favourite_level: "heavy_favourite" }, // Durnan 4-51-2 vs Robinson debut
  "fight-104": { favourite_side: "fighterA", favourite_level: "favourite" }, // Gale 2-0-0 vs Karami 4-47-4
  "fight-105": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Cooper 3-0-0 vs Osgood 2-86-0
  // Allen vs. Chvarkou — White Rhino Boxing, Magna Centre Rotherham (20 Jun 2026)
  "fight-106": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Allen #74 25-9-2 vs Chvarkou 6-33-0
  "fight-107": { favourite_side: "fighterA", favourite_level: "favourite" }, // Anaba 3-0-0 vs Ramsden 9-25-3
  "fight-108": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ellis 1-0-0 vs McElhinney 0-2-0
  "fight-109": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Gowler 1-0-0 vs Alexander 10-183-2
  "fight-110": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Carrigan 1-0-0 vs Naeem Ali 3-154-9
  "fight-111": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Sinani 1-0-0 vs Bradnum 1-43-0
  // King of the West — Toro Promotions, Celebrity Theater Phoenix (20 Jun 2026)
  "fight-112": { favourite_side: "fighterB", favourite_level: "favourite" }, // Stone #65 21-2-0 vs Ibeh 16-3-1
  "fight-113": { favourite_side: "fighterA", favourite_level: "favourite" }, // Garcia #47 17-2-0 vs Adams 12-11-1
  "fight-114": { favourite_side: "fighterA", favourite_level: "favourite" }, // Stewart 16-1-1 vs Thompson 9-2-0
  "fight-115": { favourite_side: "fighterA", favourite_level: "favourite" }, // Gonzalez 5-0-0 vs Mujica 9-9-0
  "fight-116": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Valencia 12-0-0 vs Pinillo 6-13-0
  "fight-117": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Rodriguez 12-0-1 vs Hernandez 7-24-4
  "fight-118": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Hovhannisyan 4-0-0 vs Olguin 18-50-7
  "fight-119": { favourite_side: "fighterB", favourite_level: "favourite" }, // Arroyo 2-1-0 vs Lainez debut
  "fight-120": { favourite_side: "none", favourite_level: "even" }, // Buchanan debut vs Griego 0-0-1
  "fight-121": { favourite_side: "fighterA", favourite_level: "favourite" }, // Muhammad 2-0-0 vs Cotton debut
  "fight-122": { favourite_side: "fighterA", favourite_level: "favourite" }, // Lopez 3-0-0 vs Johnson 2-2-0
  "fight-123": { favourite_side: "fighterA", favourite_level: "favourite" }, // Kotara 4-5-1 vs Davis 1-5-0
  // Back II The Future — Bey Bros Promotions, Goodyear Hall Akron (20 Jun 2026)
  "fight-124": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bey #71 26-3-1 vs Espinoza 24-9-3
  "fight-125": { favourite_side: "fighterA", favourite_level: "favourite" }, // Quarterman 8-0-0 vs Martin 10-5-1
  "fight-126": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Vega 5-0-0 vs Gomez 2-9-0
  "fight-127": { favourite_side: "fighterA", favourite_level: "favourite" }, // Antoine 11-0-0 vs Pillado 13-14-0
  "fight-128": { favourite_side: "fighterA", favourite_level: "favourite" }, // Pugh 2-0-0 vs Sarran 6-9-0
  "fight-129": { favourite_side: "fighterA", favourite_level: "favourite" }, // Fox 1-0-0 vs Stewart 4-15-1
  // Kusamura vs. Kyohara — Ichiriki Promotions, Korakuen Hall Tokyo (22 Jun 2026)
  "fight-130": { favourite_side: "fighterB", favourite_level: "favourite" }, // Kyohara #10 9-3-3 vs Kusamura 6-1-1
  "fight-131": { favourite_side: "fighterB", favourite_level: "favourite" }, // Ryu Suzuki 7-2-1 vs Ochiai 5-2-0
  "fight-132": { favourite_side: "fighterB", favourite_level: "favourite" }, // Yuta Seki 5-0-0 vs Hirayama 4-1-3
  "fight-133": { favourite_side: "fighterB", favourite_level: "favourite" }, // Shibata 1-0-0 vs Nema debut
  "fight-134": { favourite_side: "fighterB", favourite_level: "favourite" }, // Haruto Suzuki 2-0-0 vs Asakura 2-1-0
  "fight-135": { favourite_side: "none", favourite_level: "even" }, // Fukumoto 1-1-0 vs Sato 1-1-0
  "fight-136": { favourite_side: "none", favourite_level: "even" }, // Hosaka 2-0-0 vs Matsumoto 2-0-0
  "fight-137": { favourite_side: "fighterA", favourite_level: "favourite" }, // Keigo Sato 1-1-1 vs Imai 0-2-0
  // Crocker vs. Paro — No Limit Boxing, Pat Rafter Arena Tennyson (24 Jun 2026)
  "fight-138": { favourite_side: "fighterB", favourite_level: "favourite" }, // Paro -170 (box.live); some books pick'em
  "fight-139": { favourite_side: "fighterA", favourite_level: "favourite" }, // Wilson #21 18-3-0 vs Marin #123 19-0-0
  "fight-140": { favourite_side: "fighterA", favourite_level: "favourite" }, // McKean #56 24-2-0 vs Talivaa #112 8-2-0
  "fight-141": { favourite_side: "fighterA", favourite_level: "favourite" }, // Modini #26 13-0-0 vs Qu #88 17-2-1
  "fight-142": { favourite_side: "fighterB", favourite_level: "favourite" }, // Spaull #388 5-0-1 vs Jensen #475 6-1-0
  "fight-143": { favourite_side: "fighterB", favourite_level: "favourite" }, // Watson 11-3-0 vs Candy #389 8-1-0
  "fight-144": { favourite_side: "fighterA", favourite_level: "favourite" }, // Larfield #158 13-1-0 vs Anuj #767 11-8-0
  "fight-145": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Asofa-Solomona 2-0-0 vs Burgess debut
  "fight-146": { favourite_side: "fighterA", favourite_level: "favourite" }, // Javed 1-0-0 vs McDonald 1-5-1
  "fight-147": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ivic #111 8-0-1 vs Tialu #648 3-7-0
  // Pascal vs. Lafreniere — New Era Sports & Entertainment, Colisee de Laval (27 Jun 2026)
  "fight-148": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Pascal #47 37-8-1 vs Lafreniere #132 21-7-2
  "fight-149": { favourite_side: "fighterA", favourite_level: "favourite" }, // Courchesne #195 10-1-0 vs Poulin #238 10-3-3
  "fight-150": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bondo 3-0-0 vs Missengue #756 3-1-0
  "fight-151": { favourite_side: "fighterB", favourite_level: "favourite" }, // Schumann #198 4-0-0 vs Poulin #347 4-1-1
  "fight-152": { favourite_side: "fighterA", favourite_level: "favourite" }, // Gosselin #993 4-1-1 vs Canuel #1406 1-2-0
  "fight-153": { favourite_side: "fighterA", favourite_level: "favourite" }, // Oliveira #581 3-0-0 vs Ntetu #953 1-2-2
  "fight-154": { favourite_side: "fighterA", favourite_level: "favourite" }, // Perron #862 3-2-0 vs Trottier 0-1-0
  "fight-155": { favourite_side: "fighterA", favourite_level: "favourite" }, // Poulard #678 3-0-0 vs Andrade #496 2-4-0
  // Zachenhuber vs. Ajrulai — German Boxing Series, Strassenkicker Base Cologne (27 Jun 2026)
  "fight-156": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Zachenhuber #38 28-1-0 vs Ajrulai #529 10-2-0
  "fight-157": { favourite_side: "fighterA", favourite_level: "favourite" }, // Zarraa #217 15-1-0 vs Karaxha #274 34-10-4
  "fight-158": { favourite_side: "fighterA", favourite_level: "favourite" }, // Soenius #180 8-0-0 vs Lorch #508 17-2-0
  "fight-159": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Nduka #80 12-0-0 vs Iran #812 11-6-1
  "fight-160": { favourite_side: "fighterA", favourite_level: "favourite" }, // Schnell #431 9-2-0 vs Perales #666 7-5-2
  "fight-161": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Azaoun #587 4-0-0 vs Kayabasi #1345 12-27-1
  "fight-162": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Rolle #683 5-0-0 vs Teschke #2536 0-1-0
  "fight-163": { favourite_side: "none", favourite_level: "even" }, // Scherban #715 2-0-0 vs Gevorgyan 3-1-1
  "fight-164": { favourite_side: "none", favourite_level: "even" }, // Knoefel debut vs Jager #2048 0-1-0
  "fight-165": { favourite_side: "fighterB", favourite_level: "favourite" }, // Balaban #1074 5-2-2 vs Biljan #1556 1-0-0
  "fight-166": { favourite_side: "fighterB", favourite_level: "favourite" }, // Salih #800 2-1-1 vs Vizzini #982 6-5-0
  // Zayas vs. Ennis — Matchroom Boxing, Barclays Center Brooklyn (27 Jun 2026)
  "fight-167": { favourite_side: "fighterB", favourite_level: "favourite" }, // Ennis -400
  "fight-168": { favourite_side: "fighterA", favourite_level: "favourite" }, // Tucker -160
  "fight-169": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Vargas -830
  "fight-170": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Whittaker -1200
  "fight-171": { favourite_side: "fighterA", favourite_level: "favourite" }, // Williams #136 6-0-0 vs Baxter #329 8-1-0
  "fight-172": { favourite_side: "fighterA", favourite_level: "favourite" }, // Thompson #179 10-0-0 vs Rodriguez #268 12-11-3
  "fight-173": { favourite_side: "fighterA", favourite_level: "favourite" }, // Lopez De Jesus #79 5-0-0 vs Motos #358 6-2-0
  // UFC Freedom 250 — Topuria vs. Gaethje (14 Jun 2026, White House)
  "fight-174": { favourite_side: "fighterA", favourite_level: "favourite" }, // Topuria (c) vs Gaethje (ic)
  "fight-175": { favourite_side: "none", favourite_level: "even" }, // Pereira -115 vs Gane -105 (UFC.com)
  "fight-176": { favourite_side: "fighterA", favourite_level: "favourite" }, // O'Malley -360 vs Zahabi +280
  "fight-177": { favourite_side: "fighterA", favourite_level: "favourite" }, // Hokit -330 vs Lewis +265
  "fight-178": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ruffy -700 vs Chandler +500
  "fight-179": { favourite_side: "fighterA", favourite_level: "favourite" }, // Nickal -300 vs Daukaus +240
  "fight-180": { favourite_side: "fighterA", favourite_level: "favourite" }, // Lopes vs Garcia
};

describe("mock favourite alignment with market odds sheets", () => {
  for (const [fightId, expected] of Object.entries(MARKET_ALIGNED)) {
    it(`${fightId} matches converted market favourite`, () => {
      const fight = mockFights.find((f) => f.id === fightId);
      expect(fight).toBeDefined();
      expect(fight!.favourite_side).toBe(expected.favourite_side);
      expect(fight!.favourite_level).toBe(expected.favourite_level);
    });
  }
});
