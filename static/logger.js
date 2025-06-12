const logs = document.getElementById('logs');

Object.keys(console).forEach(key => {
    if (typeof console[key] !== 'function') return;

    const call = console[key];
    console[key] = (...args) => {
        const pre = document.createElement('pre');
        pre.classList.add(key);

        pre.textContent = args.join(' ') + '\n';

        // scroll
        logs.appendChild(pre);
        logs.scrollTop = logs.scrollHeight;

        call(...args);
    };
});

window.onerror = (message, source, lineno, colno, error) => {
    console.error(`${message}\n${source}:${lineno}:${colno}\n${error}`);
};