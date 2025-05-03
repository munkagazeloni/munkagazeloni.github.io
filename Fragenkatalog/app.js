let alleFragen = [];
let fragen = [];
let aktuelleFrage = 0;
let ausgewaehlt = [];

const frageId = document.getElementById("frage-id");
const frageText = document.getElementById("frage-text");
const frageBild = document.getElementById("frage-bild");
const antwortenDiv = document.getElementById("antworten");
const pruefenBtn = document.getElementById("pruefen-btn");
const naechsteBtn = document.getElementById("naechste-btn");
const frageSprung = document.getElementById("frage-sprung");

fetch("fragen.json")
  .then(res => res.json())
  .then(data => {
    alleFragen = data;
    baueModulButtons();
  });

function modusWaehlen(modus) {
  document.getElementById("startmenue").style.display = "none";
  document.getElementById("kapitelmenue").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  if (modus === "zufall") {
    fragen = [...alleFragen].sort(() => Math.random() - 0.5);
  } else if (modus === "alle") {
    fragen = [...alleFragen];
  }
  aktuelleFrage = 0;
  baueDropdown();
  zeigeFrage();
}

function baueModulButtons() {
  const module = [...new Set(alleFragen.map(f => f.modul))];
  const container = document.getElementById("modulButtons");
  container.innerHTML = "";
  module.forEach(modul => {
    const btn = document.createElement("button");
    btn.textContent = modul;
    btn.onclick = () => zeigeUnterkapitel(modul);
    container.appendChild(btn);
  });
}

function zeigeKapitel() {
  document.getElementById("startmenue").style.display = "none";
  document.getElementById("kapitelmenue").style.display = "block";
}

function zeigeUnterkapitel(modul) {
  const container = document.getElementById("unterkapitelButtons");
  container.innerHTML = "";

  const unter = alleFragen
    .filter(f => f.modul === modul)
    .map(f => f.unterkapitel);
  const unique = [...new Set(unter)];

  unique.forEach(kap => {
    const btn = document.createElement("button");
    btn.textContent = kap;
    btn.onclick = () => {
      fragen = alleFragen.filter(f => f.unterkapitel === kap);
      aktuelleFrage = 0;
      document.getElementById("kapitelmenue").style.display = "none";
      document.getElementById("quiz").style.display = "block";
      baueDropdown();
      zeigeFrage();
    };
    container.appendChild(btn);
  });
}

function zurueckZumStart() {
  document.getElementById("startmenue").style.display = "block";
  document.getElementById("kapitelmenue").style.display = "none";
}

function baueDropdown() {
  frageSprung.innerHTML = "";
  fragen.forEach((f, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = f.id;
    frageSprung.appendChild(opt);
  });
}

function zeigeFrage() {
  ausgewaehlt = [];
  pruefenBtn.style.display = "block";
  naechsteBtn.style.display = "none";
  antwortenDiv.innerHTML = "";

  const frage = fragen[aktuelleFrage];
  frageId.textContent = frage.id;
  frageText.textContent = frage.frage;

  if (frage.bild) {
    frageBild.src = "bilder/" + frage.bild;
    frageBild.style.display = "block";
  } else {
    frageBild.style.display = "none";
  }

  for (let [buchstabe, text] of Object.entries(frage.antworten)) {
    const div = document.createElement("div");
    div.classList.add("antwort");
    div.textContent = `${buchstabe}) ${text}`;
    div.dataset.buchstabe = buchstabe;

    div.addEventListener("click", () => {
      if (ausgewaehlt.includes(buchstabe)) {
        ausgewaehlt = ausgewaehlt.filter(b => b !== buchstabe);
        div.classList.remove("ausgewaehlt");
      } else {
        ausgewaehlt.push(buchstabe);
        div.classList.add("ausgewaehlt");
      }
    });

    antwortenDiv.appendChild(div);
  }

  frageSprung.value = aktuelleFrage;
}

pruefenBtn.addEventListener("click", () => {
  const frage = fragen[aktuelleFrage];
  const richtige = frage.richtig;

  document.querySelectorAll(".antwort").forEach(div => {
    const buchstabe = div.dataset.buchstabe;
    if (richtige.includes(buchstabe) && ausgewaehlt.includes(buchstabe)) {
      div.classList.add("richtig");
    } else if (richtige.includes(buchstabe)) {
      div.classList.add("richtig");
    } else if (ausgewaehlt.includes(buchstabe)) {
      div.classList.add("falsch");
    }
    div.classList.remove("ausgewaehlt");
  });

  pruefenBtn.style.display = "none";
  naechsteBtn.style.display = "block";
});

naechsteBtn.addEventListener("click", () => {
  aktuelleFrage++;
  if (aktuelleFrage >= fragen.length) {
    alert("Fertig! 🎉");
    aktuelleFrage = 0;
  }
  zeigeFrage();
});

function springeZuFrage() {
  aktuelleFrage = parseInt(frageSprung.value);
  zeigeFrage();
}