const animate = document.getElementsByClassName("animate");

const startIntersectionObserver = () => {

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const intersecting = entry.isIntersecting;

			if (intersecting) {
				entry.target.classList.add("do-animation");
				observer.unobserve(entry.target);
			}
		})
	});

	[...animate].forEach( (element) => {
		observer.observe(element);
	});
}

const init = () => {
	startIntersectionObserver();
}

export default init;