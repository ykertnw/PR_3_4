const logs = [
    '[ПЕРСОНАЖ №1] на мить відволікся, і [ПЕРСОНАЖ №2] скористався моментом та провів швидку атаку.',
    '[ПЕРСОНАЖ №1] не встиг ухилитися, коли [ПЕРСОНАЖ №2] завдав влучного удару.',
    '[ПЕРСОНАЖ №1] готувався до атаки, але [ПЕРСОНАЖ №2] випередив його.',
    '[ПЕРСОНАЖ №1] спробував захиститися, проте [ПЕРСОНАЖ №2] пробив його захист.',
    '[ПЕРСОНАЖ №1] втратив рівновагу, і [ПЕРСОНАЖ №2] завдав несподіваного удару.',
    '[ПЕРСОНАЖ №1] на секунду завагався, і [ПЕРСОНАЖ №2] атакував його з усієї сили.',
    '[ПЕРСОНАЖ №1] намагався відступити, але [ПЕРСОНАЖ №2] наздогнав його потужною атакою.',
    '[ПЕРСОНАЖ №1] занадто довго обирав прийом, і [ПЕРСОНАЖ №2] першим завдав удару.',
    '[ПЕРСОНАЖ №1] розгубився, а [ПЕРСОНАЖ №2] влучно атакував суперника.',
    '[ПЕРСОНАЖ №1] пропустив момент для захисту, і [ПЕРСОНАЖ №2] провів критичну атаку.'
];

const [$btnKick, $btnStrong] = document.querySelectorAll('.control .button');
const $logs = document.getElementById('logs');

const createPokemon = ({ name, id }) => ({
    name,
    defaultHP: 100,
    damageHP: 100,
    elHP: document.getElementById(`health-${id}`),
    elProgressbar: document.getElementById(`progressbar-${id}`),
    renderHP,
    renderHPLife,
    renderProgressbarHP,
    changeHP,
});

function renderHP() {
    this.renderHPLife();
    this.renderProgressbarHP();
}

function renderHPLife() {
    const { elHP, damageHP, defaultHP } = this;
    elHP.innerText = `${damageHP} / ${defaultHP}`;
}

function renderProgressbarHP() {
    const { elProgressbar, damageHP, defaultHP } = this;
    const percent = damageHP / defaultHP * 100;

    elProgressbar.style.width = `${percent}%`;
    elProgressbar.classList.remove('low', 'critical');

    if (percent <= 20) {
        elProgressbar.classList.add('critical');
    } else if (percent <= 60) {
        elProgressbar.classList.add('low');
    }
}

function changeHP(count, attacker) {
    if (this.damageHP <= count) {
        this.damageHP = 0;
    } else {
        this.damageHP -= count;
    }

    this.renderHP();
    addLog(generateLog(this, attacker, count));

    if (this.damageHP === 0) {
        alert(`Бідний ${this.name} програв бій!`);
        $btnKick.disabled = true;
        $btnStrong.disabled = true;
    }
}

const generateLog = (firstPerson, secondPerson, count) => {
    const { name: firstName, damageHP, defaultHP } = firstPerson;
    const { name: secondName } = secondPerson;

    const text = logs[Math.floor(Math.random() * logs.length)]
        .replace('[ПЕРСОНАЖ №1]', firstName)
        .replace('[ПЕРСОНАЖ №2]', secondName);

    return `${text} Втрати: -${count}. Залишилось життів: ${damageHP} / ${defaultHP}`;
};

const addLog = (text) => {
    const $p = document.createElement('p');
    $p.innerText = text;
    $logs.prepend($p);
};

const random = (num) => Math.ceil(Math.random() * num);

const createClickCounter = ($button, limit) => {
    let clicks = 0;
    const buttonName = $button.innerText.trim();

    $button.innerText = `${buttonName} (${limit})`;

    return () => {
        clicks++;
        const left = limit - clicks;

        console.log(`Кнопка "${buttonName}": натиснуто ${clicks} раз, залишилось ${left}`);
        $button.innerText = `${buttonName} (${left})`;

        if (left === 0) {
            $button.disabled = true;
            console.log(`Кнопка "${buttonName}" більше не доступна`);
        }
    };
};

const character = createPokemon({ name: 'Pikachu', id: 'character' });
const enemy = createPokemon({ name: 'Charmander', id: 'enemy' });

const fight = (maxDamage) => {
    character.changeHP(random(20), enemy);
    enemy.changeHP(random(maxDamage), character);
};

const buttons = [
    { $btn: $btnKick, maxDamage: 20, limit: 7 },
    { $btn: $btnStrong, maxDamage: 40, limit: 5 },
];

buttons.forEach(({ $btn, maxDamage, limit }) => {
    const countClick = createClickCounter($btn, limit);

    $btn.addEventListener('click', () => {
        countClick();
        fight(maxDamage);
    });
});

const init = () => {
    character.renderHP();
    enemy.renderHP();
};

init();
