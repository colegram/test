import Swup from 'swup';
import SwupJsPlugin from '@swup/js-plugin';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import { gsap } from 'gsap';
const options = [
	{
		from: '(.*)',
		to: '(.*)',
		in: (next, infos) => {
			let tl = gsap.timeline(); //create the timeline
			tl.set('.circle-bg', { scale: 0 });
			tl.set('.logo', { y: 10, opactiy: 0 });
			tl.to('.circle-bg', {
				opacity: 1,
				duration: 1,
				scale: 1,
				ease: 'circ.out'
			});
			// logo
			tl.to('.logo', {
				opacity: 1,
				duration: 0.5,
				y: 0,
				ease: 'circ.out'
			});
			tl.from(['.content h1', '.img-wrapper'], {
				opacity: 0,
				duration: 1,
				y: 25,
				stagger: 0.2,
				ease: 'circ.out'
			});
		},
		out: (next, infos) => {
			let tl = gsap.timeline(); //create the timeline
			tl.to('.circle-bg', {
				opacity: 1,
				duration: 1,
				scale: 0,
				// stagger: 0.2,
				ease: 'circ.out'
			});
			gsap.to(['.img-wrapper', '.content h1'], {
				opacity: 0,
				y: 50,
				duration: 1,
				delay: 0.1,
				stagger: 0.2,
				ease: 'circ.out',
				onComplete: next
			});
			gsap.to('.logo', {
				opacity: 0,
				duration: 0.5,
				y: -25,
				ease: 'circ.out',
				onComplete: next
			});
		}
	}
];

new Swup({
	containers: ['#swup'],
	linkSelector: 'a:not(.no-swup)',
	animationSelector: '[class*="transition-"]',
	cache: false,
	plugins: [new SwupJsPlugin(options), new SwupBodyClassPlugin()]
});

class ImgCursor {
	constructor() {
		this.image = document.querySelector('.img-wrapper');
		this.cursor = this.createCursor();
		this.image.appendChild(this.cursor);
		this.init();
		this.imageEvent();
	}
	init() {
		this.setDefaultState();
	}

	imageEvent() {
		this.image.addEventListener('mousemove', this.mouseMove.bind(this));
		this.image.addEventListener('mouseleave', this.mouseLeave.bind(this));
	}
	mouseMove(e) {
		this.image.classList.add('pointer-in');
		const minX = this.cursor.offsetWidth / 2;
		const maxX = this.image.offsetWidth - minX;
		const valueX = e.pageX - this.image.offsetLeft - minX;
		const posX = this.clamp(valueX, 0, maxX);
		const minY = this.cursor.offsetHeight / 2;
		const maxY = this.image.offsetHeight - minY;
		const valueY = e.pageY - this.image.offsetTop - minX;
		const posY = this.clamp(valueY, 0, maxY);

		this.cursor.setAttribute(
			'style',
			`transform:scale(1) translate3d(${posX}px, ${posY}px, 0 ); opacity: 1;`
		);
	}
	mouseLeave(e) {
		this.setDefaultState();
	}
	setDefaultState() {
		const valueX = this.image.offsetWidth / 2 - this.cursor.offsetWidth / 2;
		const valueY =
			this.image.offsetHeight / 2 - this.cursor.offsetHeight / 2;
		this.image.classList.remove('pointer-in');
		this.cursor.setAttribute(
			'style',
			`transform:scale(0) translate3d(${valueX}px, ${valueY}px, 0 ); opacity: 0`
		);
	}

	createCursor() {
		const cursor = document.createElement('div');
		cursor.classList.add('img-cursor');
		return cursor;
	}

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}
}
new ImgCursor();

class Cursor {
	constructor() {
		this.body = document.body;
		this.cursor = this.createHtml('div', ['cursor']);
		this.init();
	}
	init() {
		this.setDefaultState();
		this.setCursor();
	}
	setCursor() {
		this.cursorOutline = this.createHtml('div', [
			'cursor-outline',
			'cursor-hidden'
		]);
		this.body.appendChild(this.cursorOutline);
		this.body.appendChild(this.cursor);
		this.mouseMove(this.cursor);
		this.mouseMove(this.cursorOutline, true);
	}

	mouseMove(element, setVisible = null) {
		this.body.addEventListener('mousemove', (e) => {
			if (setVisible === true) {
				element.classList.remove('cursor-hidden');
			}
			element.setAttribute(
				'style',
				`transform:translate3d(${e.pageX}px, ${e.pageY}px, 0 )`
			);
		});
	}

	setDefaultState() {
		this.body.setAttribute('style', 'cursor: none');
	}

	createHtml(element, classNames) {
		const el = document.createElement(element);
		el.classList.add(...classNames);
		return el;
	}
}
new Cursor();

class circleBg {
	constructor() {
		this.body = document.body;
		this.init();
	}
	init() {
		this.circle = this.createHtml('div', ['circle-bg']);
		this.body.prepend(this.circle);
	}
	createHtml(element, classNames) {
		const el = document.createElement(element);
		el.classList.add(...classNames);
		return el;
	}
}
new circleBg();
