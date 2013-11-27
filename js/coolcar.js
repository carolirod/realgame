$(function() {
	/* Carousel of the logining page, choose your hahmo*/
	$('#carousel-hahmo').carouFredSel({
		responsive: true,
		width: '100%',
		height: 260,
		scroll: {
			items: 'page',
			easing: 'quadratic',
			pauseOnHover: true
		},
		items: {
			width: 150,
			height: 250,
			visible: {
				min: 1,
				max: 4,
				start: 'random'
			}
		},
		prev : { 
		  button : "#prevCarHah",
		  key : "left"
		},
		next : { 
		  button : "#nextCarHah",
		  key : "right"
		}		
	});

	/* Carousels for the features */
	$('#carousel-features').carouFredSel({
		responsive: true,
		width:'100%',
		height: 160,
		scroll: {
			items: 'page',
			duration: 800,
			pauseOnHover: true
		},
		items: {
			width:150,
			height:150,
			visible: {
				min: 3,
				max: 6,
				start:'random'
			}
		},
		prev : { 
		  button : "#prevCarFeat",
		  key : "left"
		},
		next : { 
		  button : "#nextCarFeat",
		  key : "right"
		},
	}, {
		wrapper: {
			classname: 'extrawrap'
		}
	});

});