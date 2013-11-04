$(function() {
	$('#carousel').carouFredSel({
		responsive: true,
		width: '100%',
		height: 'variable',
		scroll: {
			items: 1,
			pauseOnHover: true
		},
		items: {
			width: 150,
			height: 'variable',
			visible: {
				min: 1,
				max: 5,
				start: 'random'
			}
		}
	});

	$('#carousel-eyes').carouFredSel({
		responsive: true,
		width:'100%',
		scroll: {
			items: 1,
			pauseOnHover: true,
			duration: 800
		},
		items: {
			visible: {
				min: 1,
				max: 1,
				start:'random'
			},
			width: 150
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});

	$('#carousel-nose').carouFredSel({
		responsive: true,
		width:'100%',
		scroll: {
			items: 1,
			pauseOnHover: true
		},
		items: {
			visible: {
				min: 1,
				max: 1,
				start:'random'
			},
			width: 150
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});

	$('#carousel-mouth').carouFredSel({
		responsive: true,
		width:'100%',
		scroll: {
			items: 1,
			pauseOnHover: true
		},
		items: {
			visible: {
				min: 1,
				max: 1,
				start:'random'
			},
			width: 150
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});

	$('#carousel-skin').carouFredSel({
		responsive: true,
		width:'100%',
		scroll: {
			items: 1,
			pauseOnHover: true
		},
		items: {
			visible: {
				min: 1,
				max: 1,
				start:'random'
			},
			width: 150
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});

	$('#carousel-hair').carouFredSel({
		responsive: true,
		width:'100%',
		scroll: {
			items: 1,
			pauseOnHover: true
		},
		items: {
			visible: {
				min: 1,
				max: 1,
				start:'random'
			},
			width: 150
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});
});