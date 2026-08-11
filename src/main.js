import '@fontsource-variable/newsreader';
import '@fontsource/inter/cyrillic-400.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/cyrillic-500.css';
import '@fontsource/inter/latin-500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/motion.css';
import { createApp } from './app.js';

document.documentElement.classList.add('js');
createApp({ document, storage: window.localStorage });
