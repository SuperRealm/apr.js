import './style.css';
import b from './apr.min.css';
import { Modal, Collapse } from 'bootstrap';
// const b = document.createElement('link')
// b.setAttribute('href','https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css')
// b.setAttribute('rel','stylesheet')
// b.setAttribute('crossorigin','anonymous')
const masonry = document.createElement('script');
masonry.integrity =
	'sha384-GNFwBvfVxBkLMJpYMOABq3c+d3KnQxudP/mGPkzpZSTYykLBNsZEnG2D9G/X/+7D';
masonry.src =
	'https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js';
masonry.setAttribute('crossorigin', 'anonymous');
const page_head = document.querySelector('head');
page_head.appendChild(masonry);

const add_review_media_overlay = document.createElement('div');
const navbar_sort = document.createElement('a');
const navbar_most_recent = document.createElement('a');
const navbar_image_video = document.createElement('a');
const navbar_highest_rating = document.createElement('a');
const navbar_lowest_rating = document.createElement('a');
const reviews = document.createElement('div');
const reviews_header = document.createElement('a');
const pagination = document.createElement('div');
const overall_avg_value = document.createElement('h2');
const overall_avg_stars = document.createElement('p');
const overall_avg_title = document.createElement('p');
const overall_star_five_progress = document.createElement('div');
const overall_star_five_value = document.createElement('span');
const overall_star_four_value = document.createElement('span');
const overall_star_three_value = document.createElement('span');
const overall_star_two_value = document.createElement('span');
const overall_star_one_value = document.createElement('span');
const overall_star_five_progress_bar = document.createElement('div');
const overall_star_four_progress_bar = document.createElement('div');
const overall_star_three_progress_bar = document.createElement('div');
const overall_star_two_progress_bar = document.createElement('div');
const overall_star_one_progress_bar = document.createElement('div');
const add_review_content_right_image = document.createElement('div');
const add_review_content_left_area = document.createElement('div');
const add_review_content_left_star = document.createElement('div');
const limit_video_img = document.createElement('p');
limit_video_img.setAttribute('style', 'color:red');
const wait = document.createElement('div');
wait.innerHTML = `<div id="wait" class="${b['position-fixed']} ${b['h-100']} ${b['w-100']} ${b['d-none']}" style="z-index: 1000;top: 0;background-color: rgba(248, 249, 250, 0.5);"><div class="${b['d-flex']} ${b['justify-content-center']} ${b['h-100']} ${b['w-100']}"><div class="${b['spinner-border']} ${b['text-primary']} ${b['align-self-center']}" role="status"><span class="${b['visually-hidden']}">Loading...</span></div></div></div>`;
const page_body = document.querySelector('body');
// page_body.setAttribute('class', 'body-page');
page_body.appendChild(wait);

// // 线上地址
// let get_review_api = 'https://reviews.atomee.com/apr/getReviews';
// let show_stars_api = 'https://reviews.atomee.com/apr/showStars';
// let show_stars_status = 'https://reviews.atomee.com/apr/checkStatus';
// let show_custom = 'https://reviews.atomee.com/apr/customStyles';
// let update_review_api = 'https://reviews.atomee.com/apr/updateReviews';
// let get_insert_xpath = 'https://reviews.atomee.com/apr/getXpath';

// // 测试地址
// let get_review_api = 'https://reviewstest.atomee.com/apr/getReviews';
// let show_stars_api = 'https://reviewstest.atomee.com/apr/showStars';
// let show_stars_status = 'https://reviewstest.atomee.com/apr/checkStatus';
// let show_custom = 'https://reviewstest.atomee.com/apr/customStyles';
// let update_review_api = 'https://reviewstest.atomee.com/apr/updateReviews';
// let get_insert_xpath = 'https://reviewstest.atomee.com/apr/getXpath';

// 开发
let get_review_api = 'https://aprci.atomee.com/apr/getReviews';
let show_stars_api = 'https://aprci.atomee.com/apr/showStars';
let show_stars_status = 'https://aprci.atomee.com/apr/checkStatus';
let show_custom = 'https://aprci.atomee.com/apr/customStyles';
let update_review_api = 'https://aprci.atomee.com/apr/updateReviews';
let get_insert_xpath = 'https://aprci.atomee.com/apr/getXpath';

let current_page = 1;
let total_page = 1;
let review_more = [];
let review_all = [];
let get_page = 1;
let current_sort = 'most_recent';
let star_rating = 5;
let delete_media_number = 0;
let max_media_number = 1;
let total_media = 0;
let formData = new FormData();
let ip = null;
let name_text_is_checked = false;
let review_text_is_checked = false;
let data_temp = null;
let media_list = [];
let current_media = 0;
let publishable = true;
let msnry;
let custom = {};
// 插入star星级展示 get_starRating_div()
function get_starRating_div() {
	if (document.getElementById('atomeeStarRating')) {
		return document.getElementById('atomeeStarRating');
	} else if (document.querySelector('h1')) {
		return document.querySelector('h1');
	}
	return document.querySelector('h1');
}
/**
 * 通过xpath插入
 */
let xPathElement = '';
let starXpathEl = '';
function get_xpath() {
	fetch(get_insert_xpath, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shopId: window.BOOMR.shopId,
		}),
	})
		.then(
			res => res.json(),
			fail => console.log('error', fail)
		)
		.then(data => {
			let starXpath = data.data.starXpath;
			let xpath = data.data.xpath;
			// get_root_div()
			xPathElement =
				data.data.xpath == ''
					? get_root_div()
					: document.evaluate(xpath, document).iterateNext();
			starXpathEl =
				data.data.starXpath == ''
					? get_starRating_div()
					: document.evaluate(starXpath, document).iterateNext();
		});
}
/**
 * 获取星级展示
 */
function fetch_star() {
	let m = document.querySelectorAll("div[id^='atomeeStarRating']");
	for (var i = 0; i < m.length; i++) {
		let k = i;
		fetch(show_stars_api, {
			method: 'post',
			mode: 'cors',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				shopId: window.BOOMR.shopId,
				productId: m[k].dataset.productId,
			}),
		})
			.then(
				res => res.json(),
				fail => {
					return fail;
				}
			)
			.then(data => {
				let ratingCount = data.data.structedData.aggregateRating.ratingCount;
				let ratingValue = data.data.structedData.aggregateRating.ratingValue;
				
				// 控制星级展示隐藏
				if(data.showStar == 1){
					// 往页面加入我们app的reviews header
					const prodcut_star = document.createElement('a');
					prodcut_star.setAttribute('class', `reviews_header`);
					prodcut_star.setAttribute('style', 'text-decoration: none;');
					prodcut_star.innerHTML = get_reviews_headers(ratingValue, ratingCount);
					insertAfter(prodcut_star, m.item(k));
				}
				
			});
	}
}
//商家是否打开 Google 星级开关
function fetch_stars_status() {
	fetch(show_stars_status, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shopId: window.BOOMR.shopId,
		}),
	})
		.then(
			res => res.json(),
			fail => {
				return fail;
			}
		)
		.then(data => {
			if (data === 1) {
				const google_showstar = document.createElement('script');
				google_showstar.setAttribute('type', 'application/ld+json');
				page_head.appendChild(google_showstar);
				fetch(show_stars_api, {
					method: 'post',
					mode: 'cors',
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Headers': '*',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						shopId: window.BOOMR.shopId,
						productId: __st.rid,
					}),
				})
					.then(
						res => res.json(),
						fail => {
							return fail;
						}
					)
					.then(data => {
						google_showstar.innerHTML = JSON.stringify(data.data.structedData);
					});
			}
		});
}
/**
 * 获取用户真实ip
 */
function get_ip() {
	fetch('https://httpbin.org/ip', {
		method: 'get',
	})
		.then(
			res => res.json(),
			fail => {
				return fail;
			}
		)
		.then(data => {
			ip = data['origin'];
		});
}
//获取自定义样式
function get_custom() {
	fetch(show_custom, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shopId: window.BOOMR.shopId,
		}),
	})
		.then(
			res => res.json(),
			fail => {
				console.log('error', fail);
				custom = {
					star: '#ECA500',
					barChart: '#000000',
					buttonBorder: '#FFFFFF',
					buttonText: '#FFFFFF ',
					buttonBackground: '#000000',
					reviewsText: '#000000',
					reviewsBackground: '#FFFFFF',
					replyText: '#666666',
					verifiedBadge: '#000000',
					lineSegment: '#E2E2E2',
					buttonCorner: 0,
					barChartCorner: 0,
					reviewsBorderCorner: 0,
					shadow: 1,
				};
				setTimeout(() => {
					//获取星级
					fetch_star();
				}, 1000);
			}
		)
		.then(data => {
			// console.log('自定义', data);
			if (!!data && data.code === 200) {
				custom = data.data;
			} else {
				custom = {
					star: '#ECA500',
					barChart: '#000000',
					buttonBorder: '#FFFFFF',
					buttonText: '#FFFFFF ',
					buttonBackground: '#000000',
					reviewsText: '#000000',
					reviewsBackground: '#FFFFFF',
					replyText: '#666666',
					verifiedBadge: '#000000',
					lineSegment: '#E2E2E2',
					buttonCorner: 0,
					barChartCorner: 0,
					reviewsBorderCorner: 0,
					shadow: 1,
				};
			}
			//获取星级
			setTimeout(() => {
				fetch_star();
			}, 1000);
		});
}
/*=============================================================星星=============================================================*/
/**
 * 在商品标题下显示评论的html
 * @param avg 平均分
 * @param num 总评论数
 * @returns {string}
 */
function get_reviews_header(avg, num) {
	return `${get_avg_stars_html(avg, 14)}<span>${parseFloat(avg).toFixed(
		1
	)} (${num} reviews)</span>`;
}

// 商品页展示为星级(评论数量)
function get_reviews_headers(avg, num){
	return `${get_avg_stars_html(avg, 14)}<span>${parseFloat(avg).toFixed(
		1
	)} (${num})</span>`;
}	

/**
 * 生成平均星数的html
 * @param star_avg 平均星数
 * @param size 星星的尺寸大小
 * @returns {string}
 */
function get_avg_stars_html(star_avg, size = 16) {
	let star_fill = `<span class="${b['py-1']} ${b['pe-2']}"><svg style="width:${size}px !important;height:${size}px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b.mb1}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg></span>`;
	let star_half = `<span class="${b['py-1']} ${b['pe-2']}"><svg style="width:${size}px !important;height:${size}px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-half ${b.mb1}" viewBox="0 0 16 16"><path d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z" style="color:${custom.star}" fill=${custom.star} stroke="none" /></svg></span>`;
	let star = `<span class="${b['py-1']} ${b['pe-2']}"><svg style="width:${size}px !important;height:${size}px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star ${b.mb1}" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg></span>`;

	let star_fill_num = Math.floor(star_avg / 1);
	let star_half_num = 0;
	if (star_avg - star_fill_num >= 0.75) {
		star_fill_num += 1;
	} else if (star_avg - star_fill_num >= 0.25) {
		star_half_num = 1;
	}
	let star_num = 5 - star_fill_num - star_half_num;
	return (
		new Array(star_fill_num + 1).join(star_fill) +
		new Array(star_half_num + 1).join(star_half) +
		new Array(star_num + 1).join(star)
	);
}

/**
 * 星星数字被点击
 */
function stars_value_click() {
	fetch_reviews(1, parseInt(this.id.match(/\d+/gi)[0]));
}

/**
 * 生成编写评论星星的html
 * @returns {string}
 */
function get_review_content_left_star_html() {
	return `<span style="font-weight: 600;font-size:13.5pt;" class="${b['me-4']}">Your rating:</span>
	<div><span id="star1" onclick="star_click(this)" onmouseover="star_onmouseover(this)" onmouseout="star_onmouseout(this)" " class="${b['btn']} btn_focus_color_none ${b['p-0']} ${b['pb-1']}">
	<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg></span>&nbsp;<span id="star2" onclick="star_click(this)" onmouseover="star_onmouseover(this)" onmouseout="star_onmouseout(this)" " class="${b['btn']} btn_focus_color_none  ${b['p-0']} ${b['pb-1']}">
	<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path  d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg></span>&nbsp;<span id="star3" onclick="star_click(this)" onmouseover="star_onmouseover(this)" onmouseout="star_onmouseout(this)" " class="${b['btn']} btn_focus_color_none  ${b['p-0']} ${b['pb-1']}">
	<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg></span>&nbsp;<span id="star4" onclick="star_click(this)" onmouseover="star_onmouseover(this)" onmouseout="star_onmouseout(this)" " class="${b['btn']} btn_focus_color_none  ${b['p-0']} ${b['pb-1']}">
	<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg></span>&nbsp;<span id="star5" onclick="star_click(this)" onmouseover="star_onmouseover(this)" onmouseout="star_onmouseout(this)" " class="${b['btn']} btn_focus_color_none  ${b['p-0']} ${b['pb-1']}">
	<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg></span></div>&nbsp;
<span id="star_rating" class="${b['ms-4']} star-text" style="font-size: 12pt;font-weight:Bold;line-height: 28px;">5/5</span>`;
}

/**
 * 评论里星星鼠标滑过动画
 * @param el 点击的element
 */
window.star_onmouseover = function (el) {
	let star_fill = `<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg>`;
	let star = `<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star ${b['pe-none']}" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg>`;
	document.getElementById('star2').innerHTML = star;
	document.getElementById('star3').innerHTML = star;
	document.getElementById('star4').innerHTML = star;
	document.getElementById('star5').innerHTML = star;
	if (el.id === 'star1') {
		return;
	}
	document.getElementById('star2').innerHTML = star_fill;
	if (el.id === 'star2') {
		return;
	}
	document.getElementById('star3').innerHTML = star_fill;
	if (el.id === 'star3') {
		return;
	}
	document.getElementById('star4').innerHTML = star_fill;
	if (el.id === 'star4') {
		return;
	}
	document.getElementById('star5').innerHTML = star_fill;
};

/**
 * 评论里星星鼠标滑出动画
 */
window.star_onmouseout = function () {
	let star_fill = `<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill ${b['pe-none']}" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg>`;
	let star = `<svg style="width:22px !important;height:22px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star ${b['pe-none']}" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" style="color:${custom.star}" fill=${custom.star} stroke="none"></path></svg>`;
	document.getElementById('star1').innerHTML = star_fill;
	document.getElementById('star2').innerHTML = star;
	document.getElementById('star3').innerHTML = star;
	document.getElementById('star4').innerHTML = star;
	document.getElementById('star5').innerHTML = star;
	if (star_rating === 1) {
		return;
	}
	document.getElementById('star2').innerHTML = star_fill;
	if (star_rating === 2) {
		return;
	}
	document.getElementById('star3').innerHTML = star_fill;
	if (star_rating === 3) {
		return;
	}
	document.getElementById('star4').innerHTML = star_fill;
	if (star_rating === 4) {
		return;
	}
	document.getElementById('star5').innerHTML = star_fill;
};

/**
 * 评论里星星点击事件
 * @param el 点击的element
 */
window.star_click = function (el) {
	switch (el.id) {
		case 'star1':
			star_rating = 1;
			document.getElementById('star_rating').innerText = '1/5';
			break;
		case 'star2':
			star_rating = 2;
			document.getElementById('star_rating').innerText = '2/5';
			break;
		case 'star3':
			star_rating = 3;
			document.getElementById('star_rating').innerText = '3/5';
			break;
		case 'star4':
			star_rating = 4;
			document.getElementById('star_rating').innerText = '4/5';
			break;
		case 'star5':
			star_rating = 5;
			document.getElementById('star_rating').innerText = '5/5';
			break;
		default:
	}
};

/*=============================================================media=============================================================*/

/**
 * 取消上传的视频
 * @param el 点击的element
 */
window.btn_close_click = function (el) {
	delete_media_number = parseInt(el.id.match(/\d+/gi)[0]);
	delete_media();
	limit_video_img.innerText = '';
};

/**
 * 删除上传的media
 */
window.delete_media = function () {
	let node = document.getElementById('media' + delete_media_number);
	document.getElementById('medias').removeChild(node);
	total_media -= 1;
	for (let key of formData.keys()) {
		if (key.match(new RegExp('_\\d+', 'ig')) != null) {
			if (parseInt(key.match(/\d+/gi)[0]) === delete_media_number) {
				formData.delete(key);
			}
		}
	}
	if (total_media === 5) {
		max_media_number += 1;
		let media_div = document.createElement('div');
		media_div.setAttribute('class', `media_cover ${b['me-3']} ${b['mb-3']}`);
		media_div.setAttribute('id', 'media' + max_media_number);
		media_div.innerHTML = `<label style="background-color:#ffffff" for="upload_media_${max_media_number}" class="${b['btn']} ${b['border']} label_size ${b['p-0']}"><input class="${b['d-none']}" type="file" id="upload_media_${max_media_number}" accept="image/*，video/*" onchange="input_image_change(this)"><svg style="width:20px !important;height:20px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-plus ${b['position-relative']} ${b['top-50']} ${b['start-0']} ${b['translate-middle-y']} ${b['mb-2']}" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" style="color:currentColor" fill="currentColor" stroke="none"/></svg></label><span id="total_media_num" style="position:absolute;bottom:1em;font-size:10.5pt;">${total_media}/6</span>`;
		document
			.getElementById('medias')
			.setAttribute('style', 'position:relative');
		document.getElementById('medias').appendChild(media_div);
	} else {
		document.getElementById('total_media_num').innerText = `${total_media}/6`;
	}
};

/**
 * 显示上传的图片或视频
 * @param el
 */
window.input_image_change = function (el) {
	insertAfter(limit_video_img, add_review_content_right_image);
	let number = parseInt(el.id.match(/\d+/gi)[0]);
	let close = `<span id="close${number}" class="close_btn_position ${b['btn']} btn_focus_color_none" onclick="btn_close_click(this)"><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-x ${b['bg-danger']} ${b['rounded-circle']}" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" style="color:#ffffff" fill="#ffffff" stroke="none"/></svg></span>`;
	let url = '';
	max_media_number += 1;
	let media_div = document.createElement('div');
	if (el.files[0].type.indexOf('image') === 0) {
		// 如果是图片
		let blob_ = new Blob([el.files[0]], { type: 'application/octet-binary' });
		let url = URL.createObjectURL(blob_);
		let media = `<img id='img_${number}' class='media_cover el_middle single_media max_width_100' src='${url}' alt=''/>`;
		document.getElementById('media' + number).innerHTML = media + close;
		total_media += 1;
		expand_img();
		formData.append('img_' + number, el.files[0]);
	} else if (el.files[0].type.indexOf('video') === 0) {
		if (window.createObjectURL !== undefined) {
			// basic
			url = window.createObjectURL(el.files[0]);
		} else if (window.URL !== undefined) {
			// mozilla(firefox)
			url = window.URL.createObjectURL(el.files[0]);
		} else if (window.webkitURL !== undefined) {
			// webkit or chrome
			url = window.webkitURL.createObjectURL(el.files[0]);
		}
		total_media += 1;
		let audio_el = new Audio(url);
		audio_el.addEventListener('loadedmetadata', function () {
			limit_video_img.innerText = '';
			// let duration = audio_el.duration;
			if (el.files[0].size / 1024 < 20 * 1024) {
				let media = `<video id='video_${number}' class='video_cover' src='${url}'></video>`;
				document.getElementById('media' + number).innerHTML = media + close;
				expand_video();
				formData.append('video_' + number, el.files[0]);
			} else {
				total_media -= 1;
				media_div.remove(document.getElementById('media' + number));
				limit_video_img.innerText = `The video must be under 20M`;
			}
		});
	} else {
		return alert('Only mp4, webm, jpg and png files are supported!');
	}

	if (total_media < 6) {
		if (total_media === 5) {
			media_div.setAttribute('class', `media_cover ${b['mb-3']}`);
		} else {
			media_div.setAttribute('class', `media_cover ${b['me-3']} ${b['mb-3']}`);
		}
		media_div.setAttribute('id', 'media' + max_media_number);
		media_div.innerHTML = `<label style="background-color:#ffffff" for="upload_media_${max_media_number}" class="${b['btn']} ${b['border']} label_size ${b['p-0']}"><input class="${b['d-none']}" type="file" id="upload_media_${max_media_number}" accept="image/*，video/*" onchange="input_image_change(this)"><svg style="width:20px !important;height:20px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-plus ${b['position-relative']} ${b['top-50']} ${b['start-0']} ${b['translate-middle-y']} ${b['mb-2']}" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" style="color:currentColor" fill="currentColor" stroke="none"/></svg></label><span id="total_media_num" style="position:absolute;bottom:1em;font-size:10.5pt">${total_media}/6</span>`;
		document
			.getElementById('medias')
			.setAttribute('style', 'position:relative');
		document.getElementById('medias').appendChild(media_div);
	}
};

/**
 * 生成上传图片控件html
 * @returns {string}
 */
function get_review_content_right_media_html() {
	return `<div style="position:relative" id="media1" class="media_cover ${b['me-3']} ${b['mb-3']}"><label style="background-color:#ffffff" for="upload_media_1" class="${b['btn']} ${b['border']} label_size ${b['p-0']}"><input class="${b['d-none']}" type="file" id="upload_media_1" accept="image/*，video/*" onchange="input_image_change(this)"><svg style="width:20px !important;height:20px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-plus ${b['position-relative']} ${b['top-50']} ${b['start-0']} ${b['translate-middle-y']} ${b['mb-2']}" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" style="color:currentColor" fill="currentColor" stroke="none"/></svg></label><span style="position:absolute;bottom:0;font-size:10.5pt">0/6</span></div>`;
}

/**
 * 给所有评论的图片添加放大查看的事件
 */
function expand_img() {
	let imgs = document.getElementsByClassName('single_media');
	for (let i = 0; i < imgs.length; i++) {
		imgs[i].onclick = expandPhoto;
		imgs[i].onkeydown = expandPhoto;
	}
}

/**
 * 给所有评论的视频添加放大查看的事件
 */
function expand_video() {
	let videos = document.getElementsByTagName('video');
	for (let i = 0; i < videos.length; i++) {
		videos[i].onclick = expandVideo;
		videos[i].onkeydown = expandVideo;
	}
}

/**
 * 放大查看视频功能
 */
function expandVideo() {
	add_review_media_overlay.innerHTML = `
    <div class="modal-dialog modal-dialog-centered ${
			b['justify-content-center']
		}">
        <div class="modall-content">
            <video id="watchVideo" loop controls="controls" key="${Math.random()}" autoplay="true" controls="controls" loop="true" style="max-height:500px;">
                <source src="${this.getAttribute('src')}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
    `;
	document.body.appendChild(add_review_media_overlay);
	let overlay_modal = new Modal(document.getElementById('overlay'));
	document.getElementById('overlay').addEventListener('click', function () {
		document.getElementById('watchVideo').pause();
	});
	overlay_modal.show();
	document.body.style.overflow = 'auto';
	document.body.style.paddingRight = '0';
}

/**
 * 放大查看图片功能
 */
function expandPhoto() {
	add_review_media_overlay.innerHTML = `
    <div class="modal-dialog modal-dialog-centered ${
			b['justify-content-center']
		}">
        <div class="modall-content ${b['border-0']}"style="padding: 0px;">
            <img src='${this.getAttribute(
							'src'
						)}' class="max_width_100" onclick="restore()" alt="">
        </div>
    </div>
    `;
	document.body.appendChild(add_review_media_overlay);
	let overlay_modal = new Modal(document.getElementById('overlay'));
	overlay_modal.show();
}

/**
 * 隐藏弹出框
 */
window.restore = function () {
	let my_modal_overlay = document.getElementById('overlay');
	let overlay_modal = Modal.getInstance(my_modal_overlay);
	overlay_modal.hide();
};

/*=============================================================表单=============================================================*/

/**
 * 提交评论按钮事件
 */
window.publish = function () {
	get_page = 1;
	let status = true;
	if (!name_text_is_checked) {
		document.getElementById('name').classList.add('danger');
		status = false;
	}
	if (!review_text_is_checked) {
		document.getElementById('review_text').classList.add('danger');
		status = false;
	}

	if (!publishable || !status) {
		return;
	} else {
		publishable = false;
	}
	formData.append('action', '1');
	formData.append('product_id', __st.rid);
	formData.append('name', document.getElementById('name').value);
	formData.append(
		'country_region',
		document.getElementById('country_region').value
	);
	formData.append('star_rating', star_rating);
	formData.append('content', document.getElementById('review_text').value);
	formData.append('ip', ip);
	document.getElementById('wait').classList.remove(`${b['d-none']}`);
	fetch(update_review_api, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
		},
		body: formData,
	})
		.then(res => res.json())
		.catch(error => {
			console.error('Error:', error);
			publishable = true;
			document.getElementById('wait').classList.add(`${b['d-none']}`);
		})
		.then(data => {
			document.getElementById('wait').classList.add(`${b['d-none']}`);
			if (data['status'] === 'success') {
				//提交成功后复原清空 编辑框 复原add review按钮
				if (data['apr_billing_plan'] !== 0) {
					add_review_content_right_image.innerHTML =
						get_review_content_right_media_html();
				}
				// document.getElementById('medias').innerHTML =
				// get_review_content_right_media_html();

				name_text_is_checked = false;
				review_text_is_checked = false;
				max_media_number = 1;
				total_media = 0;
				star_rating = 5;
				formData = null;
				formData = new FormData();
				star_onmouseout();
				document.getElementById('name').value = '';
				document.getElementById('review_text').value = '';
				let myCollapse = document.getElementById('add_review');
				let bsCollapse = new Collapse(myCollapse, {
					toggle: true,
				});
				publishable = true;
				// 刷新评论
				// init();
				limit_video_img.innerText = ``;
				document.getElementById('limitFont').innerText = '0-1500 characters';
				add_review_content_left_area.innerHTML = `<div style="font-size:13.5pt;font-weight:600;" class="${b['form-label']}">Country(Optional):</div><select class="${b['form-select']}" id="country_region" name="value"><option selected disabled style="display:none;" value="">Select a country or region</option><option value="Afghanistan">Afghanistan</option><option value="&Aring;land Islands">&Aring;land Islands</option><option value="Albania">Albania</option><option value="Algeria">Algeria</option><option value="American Samoa">American Samoa</option><option value="Andorra">Andorra</option><option value="Angola">Angola</option><option value="Anguilla">Anguilla</option><option value="Antarctica">Antarctica</option><option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option><option value="Argentina">Argentina</option><option value="Armenia">Armenia</option><option value="Aruba">Aruba</option><option value="Australia">Australia</option><option value="Austria">Austria</option><option value="Azerbaijan">Azerbaijan</option><option value="Bahamas">Bahamas</option><option value="Bahrain">Bahrain</option><option value="Bangladesh">Bangladesh</option><option value="Barbados">Barbados</option><option value="Belarus">Belarus</option><option value="Belgium">Belgium</option><option value="Belize">Belize</option><option value="Benin">Benin</option><option value="Bermuda">Bermuda</option><option value="Bhutan">Bhutan</option><option value="Bolivia">Bolivia</option><option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option><option value="Botswana">Botswana</option><option value="Bouvet Island">Bouvet Island</option><option value="Brazil">Brazil</option><option value="British Indian Ocean Territory">British Indian Ocean Territory</option><option value="British Virgin Islands">British Virgin Islands</option><option value="Brunei">Brunei</option><option value="Bulgaria">Bulgaria</option><option value="Burkina Faso">Burkina Faso</option><option value="Burundi">Burundi</option><option value="Cambodia">Cambodia</option><option value="Cameroon">Cameroon</option><option value="Canada">Canada</option><option value="Cape Verde">Cape Verde</option><option value="Caribbean Netherlands">Caribbean Netherlands</option><option value="Cayman Islands">Cayman Islands</option><option value="Central African Republic">Central African Republic</option><option value="Chad">Chad</option><option value="Chile">Chile</option><option value="China">China</option><option value="Christmas Island">Christmas Island</option><option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option><option value="Colombia">Colombia</option><option value="Comoros">Comoros</option><option value="Congo - Brazzaville">Congo - Brazzaville</option><option value="Congo - Kinshasa">Congo - Kinshasa</option><option value="Cook Islands">Cook Islands</option><option value="Costa Rica">Costa Rica</option><option value="C&ocirc;te d&rsquo;Ivoire">C&ocirc;te d&rsquo;Ivoire</option><option value="Croatia">Croatia</option><option value="Cuba">Cuba</option><option value="Cura&ccedil;ao">Cura&ccedil;ao</option><option value="Cyprus">Cyprus</option><option value="Czechia">Czechia</option><option value="Denmark">Denmark</option><option value="Djibouti">Djibouti</option><option value="Dominica">Dominica</option><option value="Dominican Republic">Dominican Republic</option><option value="Ecuador">Ecuador</option><option value="Egypt">Egypt</option><option value="El Salvador">El Salvador</option><option value="Equatorial Guinea">Equatorial Guinea</option><option value="Eritrea">Eritrea</option><option value="Estonia">Estonia</option><option value="Eswatini">Eswatini</option><option value="Ethiopia">Ethiopia</option><option value="Falkland Islands">Falkland Islands</option><option value="Faroe Islands">Faroe Islands</option><option value="Fiji">Fiji</option><option value="Finland">Finland</option><option value="France">France</option><option value="French Guiana">French Guiana</option><option value="French Polynesia">French Polynesia</option><option value="French Southern Territories">French Southern Territories</option><option value="Gabon">Gabon</option><option value="Gambia">Gambia</option><option value="Georgia">Georgia</option><option value="Germany">Germany</option><option value="Ghana">Ghana</option><option value="Gibraltar">Gibraltar</option><option value="Greece">Greece</option><option value="Greenland">Greenland</option><option value="Grenada">Grenada</option><option value="Guadeloupe">Guadeloupe</option><option value="Guam">Guam</option><option value="Guatemala">Guatemala</option><option value="Guernsey">Guernsey</option><option value="Guinea">Guinea</option><option value="Guinea-Bissau">Guinea-Bissau</option><option value="Guyana">Guyana</option><option value="Haiti">Haiti</option><option value="Heard &amp; McDonald Islands">Heard &amp; McDonald Islands</option><option value="Honduras">Honduras</option><option value="Hong Kong SAR China">Hong Kong SAR China</option><option value="Hungary">Hungary</option><option value="Iceland">Iceland</option><option value="India">India</option><option value="Indonesia">Indonesia</option><option value="Iran">Iran</option><option value="Iraq">Iraq</option><option value="Ireland">Ireland</option><option value="Isle of Man">Isle of Man</option><option value="Israel">Israel</option><option value="Italy">Italy</option><option value="Jamaica">Jamaica</option><option value="Japan">Japan</option><option value="Jersey">Jersey</option><option value="Jordan">Jordan</option><option value="Kazakhstan">Kazakhstan</option><option value="Kenya">Kenya</option><option value="Kiribati">Kiribati</option><option value="Kuwait">Kuwait</option><option value="Kyrgyzstan">Kyrgyzstan</option><option value="Laos">Laos</option><option value="Latvia">Latvia</option><option value="Lebanon">Lebanon</option><option value="Lesotho">Lesotho</option><option value="Liberia">Liberia</option><option value="Libya">Libya</option><option value="Liechtenstein">Liechtenstein</option><option value="Lithuania">Lithuania</option><option value="Luxembourg">Luxembourg</option><option value="Macao SAR China">Macao SAR China</option><option value="Madagascar">Madagascar</option><option value="Malawi">Malawi</option><option value="Malaysia">Malaysia</option><option value="Maldives">Maldives</option><option value="Mali">Mali</option><option value="Malta">Malta</option><option value="Marshall Islands">Marshall Islands</option><option value="Martinique">Martinique</option><option value="Mauritania">Mauritania</option><option value="Mauritius">Mauritius</option><option value="Mayotte">Mayotte</option><option value="Mexico">Mexico</option><option value="Micronesia">Micronesia</option><option value="Moldova">Moldova</option><option value="Monaco">Monaco</option><option value="Mongolia">Mongolia</option><option value="Montenegro">Montenegro</option><option value="Montserrat">Montserrat</option><option value="Morocco">Morocco</option><option value="Mozambique">Mozambique</option><option value="Myanmar (Burma)">Myanmar (Burma)</option><option value="Namibia">Namibia</option><option value="Nauru">Nauru</option><option value="Nepal">Nepal</option><option value="Netherlands">Netherlands</option><option value="New Caledonia">New Caledonia</option><option value="New Zealand">New Zealand</option><option value="Nicaragua">Nicaragua</option><option value="Niger">Niger</option><option value="Nigeria">Nigeria</option><option value="Niue">Niue</option><option value="Norfolk Island">Norfolk Island</option><option value="North Korea">North Korea</option><option value="North Macedonia">North Macedonia</option><option value="Northern Mariana Islands">Northern Mariana Islands</option><option value="Norway">Norway</option><option value="Oman">Oman</option><option value="Pakistan">Pakistan</option><option value="Palau">Palau</option><option value="Palestinian Territories">Palestinian Territories</option><option value="Panama">Panama</option><option value="Papua New Guinea">Papua New Guinea</option><option value="Paraguay">Paraguay</option><option value="Peru">Peru</option><option value="Philippines">Philippines</option><option value="Pitcairn Islands">Pitcairn Islands</option><option value="Poland">Poland</option><option value="Portugal">Portugal</option><option value="Puerto Rico">Puerto Rico</option><option value="Qatar">Qatar</option><option value="R&eacute;union">R&eacute;union</option><option value="Romania">Romania</option><option value="Russia">Russia</option><option value="Rwanda">Rwanda</option><option value="Samoa">Samoa</option><option value="San Marino">San Marino</option><option value="S&atilde;o Tom&eacute; &amp; Pr&iacute;ncipe">S&atilde;o Tom&eacute; &amp; Pr&iacute;ncipe</option><option value="Saudi Arabia">Saudi Arabia</option><option value="Senegal">Senegal</option><option value="Serbia">Serbia</option><option value="Seychelles">Seychelles</option><option value="Sierra Leone">Sierra Leone</option><option value="Singapore">Singapore</option><option value="Sint Maarten">Sint Maarten</option><option value="Slovakia">Slovakia</option><option value="Slovenia">Slovenia</option><option value="Solomon Islands">Solomon Islands</option><option value="Somalia">Somalia</option><option value="South Africa">South Africa</option><option value="South Georgia &amp; South Sandwich Islands">South Georgia &amp; South Sandwich Islands</option><option value="South Korea">South Korea</option><option value="South Sudan">South Sudan</option><option value="Spain">Spain</option><option value="Sri Lanka">Sri Lanka</option><option value="St. Barth&eacute;lemy">St. Barth&eacute;lemy</option><option value="St. Helena">St. Helena</option><option value="St. Kitts &amp; Nevis">St. Kitts &amp; Nevis</option><option value="St. Lucia">St. Lucia</option><option value="St. Martin">St. Martin</option><option value="St. Pierre &amp; Miquelon">St. Pierre &amp; Miquelon</option><option value="St. Vincent &amp; Grenadines">St. Vincent &amp; Grenadines</option><option value="Sudan">Sudan</option><option value="Suriname">Suriname</option><option value="Svalbard &amp; Jan Mayen">Svalbard &amp; Jan Mayen</option><option value="Sweden">Sweden</option><option value="Switzerland">Switzerland</option><option value="Syria">Syria</option><option value="Taiwan">Taiwan</option><option value="Tajikistan">Tajikistan</option><option value="Tanzania">Tanzania</option><option value="Thailand">Thailand</option><option value="Timor-Leste">Timor-Leste</option><option value="Togo">Togo</option><option value="Tokelau">Tokelau</option><option value="Tonga">Tonga</option><option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option><option value="Tunisia">Tunisia</option><option value="Turkey">Turkey</option><option value="Turkmenistan">Turkmenistan</option><option value="Turks &amp; Caicos Islands">Turks &amp; Caicos Islands</option><option value="Tuvalu">Tuvalu</option><option value="U.S. Outlying Islands">U.S. Outlying Islands</option><option value="U.S. Virgin Islands">U.S. Virgin Islands</option><option value="Uganda">Uganda</option><option value="Ukraine">Ukraine</option><option value="United Arab Emirates">United Arab Emirates</option><option value="United Kingdom">United Kingdom</option><option value="United States">United States</option><option value="Uruguay">Uruguay</option><option value="Uzbekistan">Uzbekistan</option><option value="Vanuatu">Vanuatu</option><option value="Vatican City">Vatican City</option><option value="Venezuela">Venezuela</option><option value="Vietnam">Vietnam</option><option value="Wallis &amp; Futuna">Wallis &amp; Futuna</option><option value="Western Sahara">Western Sahara</option><option value="Yemen">Yemen</option><option value="Zambia">Zambia</option><option value="Zimbabwe">Zimbabwe</option></select>`;
				document
					.getElementById('country_region')
					.addEventListener('change', function () {
						document.getElementById('country_region').style.color = '#000000';
					});
				add_review_content_left_star.innerHTML =
					get_review_content_left_star_html();
				update_review_get();
				if (data['review_theme'] === 1) {
					theme_1_show_read_more();
				} else {
					create_masonry();
					loadmore_btn(data['reviews'].length);
				}
			} else {
				formData.delete('action');
				formData.delete('product_id');
				formData.delete('name');
				formData.delete('country_region');
				formData.delete('star_rating');
				formData.delete('content');
				formData.delete('ip');
				console.log('error data', data);
				publishable = true;
			}
		});
};
function update_review_get() {
	fetch(get_review_api, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shop_id: window.BOOMR.shopId,
			product_id: __st.rid,
			sorted_by: current_sort,
			request_page: 1,
			filter: 1,
		}),
	})
		.then(
			res => res.json(),
			fail => console.log('出错了', fail)
		)
		.then(data => {
			let t = data;
			data_temp = t;
			//laodmore
			review_more = data_temp['reviews'];
			review_all = [];
			let temp = review_all.concat(data_temp['reviews']);
			review_all = temp;
			current_page = 1;
			total_page = parseInt(data_temp['pages']);
			let total_stars =
				parseInt(data_temp['five_stars']) +
				parseInt(data_temp['four_stars']) +
				parseInt(data_temp['three_stars']) +
				parseInt(data_temp['two_stars']) +
				parseInt(data_temp['one_stars']);


			if(data['showStar'] == 1){
				// 更新统计数据
				reviews_header.setAttribute('class', `reviewsl_header`);
				reviews_header.href = '#atomeeReviewsApp';
				reviews_header.innerHTML = get_reviews_header(
					data_temp['avg'],
					data_temp['total_review']
				);
				insertAfter(reviews_header, starXpathEl);
			}
			
			// 更新统计数据
			// reviews_header.innerHTML = get_reviews_header(
			// 	data_temp['avg'],
			// 	data_temp['total_review']
			// );
			overall_avg_value.innerText = parseFloat(data_temp['avg']).toFixed(1);
			overall_avg_stars.innerHTML = get_avg_stars_html(data_temp['avg']);
			overall_avg_title.innerText =
				'Based on ' + `${data_temp['total_review']}` + ' reviews';

			overall_star_five_value.innerText = data_temp['five_stars'];
			overall_star_four_value.innerText = data_temp['four_stars'];
			overall_star_three_value.innerText = data_temp['three_stars'];
			overall_star_two_value.innerText = data_temp['two_stars'];
			overall_star_one_value.innerText = data_temp['one_stars'];
			overall_star_five_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data_temp['five_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_four_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data_temp['four_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_three_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data_temp['three_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_two_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data_temp['two_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_one_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data_temp['one_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);

			if (data_temp['review_theme'] === 1) {
				reviews.innerHTML = get_reviews_html(data_temp);
			}
			if (data_temp['review_theme'] === 2) {
				create_masonry();
				loadmore_btn(data['reviews'].length);
			}
			expand_img();
			expand_video();
			console.log('success', data_temp);
		});
}

/*=============================================================评论显示=============================================================*/
/*-------------------------------------------------------------排序方式-------------------------------------------------------------*/
/**
 * 排序方式划出动画
 * @param el
 */
window.sort_onmouseout = function (el) {
	let navbar_sort_id = navbar_sort.getAttribute('value');
	switch (el.id) {
		case 'navbar_most_recent':
			if (navbar_sort_id !== 'navbar_most_recent') {
				navbar_most_recent.setAttribute(
					'class',
					`${b['nav-link']} ${b['p-0']} ${b['pb-1']} ${b['text-dark']}`
				);
				navbar_most_recent.setAttribute('style', 'border-bottom: 0px;');
			}
			break;
		case 'navbar_image_video':
			if (navbar_sort_id !== 'navbar_image_video') {
				navbar_image_video.setAttribute(
					'class',
					`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
				);
				navbar_image_video.setAttribute('style', 'border-bottom: 0px;');
			}
			break;
		case 'navbar_highest_rating':
			if (navbar_sort_id !== 'navbar_highest_rating') {
				navbar_highest_rating.setAttribute(
					'class',
					`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
				);
				navbar_highest_rating.setAttribute('style', 'border-bottom: 0px;');
			}
			break;
		case 'navbar_lowest_rating':
			if (navbar_sort_id !== 'navbar_lowest_rating') {
				navbar_lowest_rating.setAttribute(
					'class',
					`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
				);
				navbar_lowest_rating.setAttribute('style', 'border-bottom: 0px;');
			}
			break;
		default:
	}
};

/**
 * 排序方式被点击
 * @param el
 */
window.sort_click = function (el) {
	get_page = 1;
	switch (el.innerText) {
		case 'Image/Video':
			current_sort = 'image_video';
			break;
		case 'Highest Rating':
			current_sort = 'highest_rating';
			break;
		case 'Lowest Rating':
			current_sort = 'lowest_rating';
			break;
		case 'Recent':
			current_sort = 'most_recent';
			break;
		default:
	}
	let sort_id = navbar_sort.getAttribute('value');
	document.getElementById('wait').classList.remove(`${b['d-none']}`);
	fetch(get_review_api, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shop_id: window.BOOMR.shopId,
			product_id: __st.rid,
			sorted_by: current_sort,
			request_page: 1,
			filter: 1,
		}),
	})
		.then(
			res => res.json(),
			fail => {
				document.getElementById('wait').classList.add(`${b['d-none']}`);
				return fail;
			}
		)
		.then(data => {
			document.getElementById('wait').classList.add(`${b['d-none']}`);
			review_more = data['reviews'];
			review_all = [];
			let temp = review_all.concat(data['reviews']);
			review_all = temp;
			let t = data;
			data_temp = t;
			navbar_sort.setAttribute('value', el.id);
			sort_onmouseover(el);
			sort_onmouseout(document.getElementById(sort_id));
			current_page = 1;

			total_page = parseInt(data['pages']);
			if (data['review_theme'] === 1) {
				reviews.innerHTML = get_reviews_html(data);
				expand_img();
				expand_video();
			}
			if (data['review_theme'] === 2) {
				create_masonry();
				loadmore_btn(data['reviews'].length);
			}
		});
};

/**
 * 排序方式划入动画
 * @param el
 */
window.sort_onmouseover = function (el) {
	switch (el.id) {
		case 'navbar_most_recent':
			navbar_most_recent.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} ${b['text-dark']} ${b['border-2']}`
			);
			navbar_most_recent.setAttribute(
				'style',
				`border-bottom: 5px solid ${custom.barChart} !important;`
			);
			break;
		case 'navbar_image_video':
			navbar_image_video.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms  ${b['text-dark']} ${b['border-2']}`
			);
			navbar_image_video.setAttribute(
				'style',
				`border-bottom: 5px solid ${custom.barChart} !important;`
			);
			break;
		case 'navbar_highest_rating':
			navbar_highest_rating.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms  ${b['text-dark']} ${b['border-2']}`
			);
			navbar_highest_rating.setAttribute(
				'style',
				`border-bottom: 5px solid ${custom.barChart} !important;`
			);
			break;
		case 'navbar_lowest_rating':
			navbar_lowest_rating.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms  ${b['text-dark']} ${b['border-2']}`
			);
			navbar_lowest_rating.setAttribute(
				'style',
				`border-bottom: 5px solid ${custom.barChart} !important;`
			);
			break;
		default:
	}
};

/**
 * 根据星星数得到星星的html
 * @param star_fill_num 填充的星数
 * @returns {string}
 */
function get_review_star_html(star_fill_num) {
	let star_fill = `<span style="margin-right: 2px;height: 16px;"><svg xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill star-size" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg></span>`;
	let star = `<span style="margin-right: 2px;height: 16px;"><svg xmlns="http://www.w3.org/2000/svg" class="bi bi-star star-size" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg></span>`;
	return `<p class="apr-star-margin">${new Array(star_fill_num + 1).join(
		star_fill
	)}${new Array(5 - star_fill_num + 1).join(star)}</p>`;
}

/*-------------------------------------------------------------评论内容-------------------------------------------------------------*/
/**
 * 转换时间戳
 * @param millinSeconds
 * @returns {string}
 */
function formatDate(millinSeconds) {
	let date = new Date(millinSeconds * 1000);
	let monthArr = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Spt',
		'Oct',
		'Nov',
		'Dec',
	];
	let suffix = ['st', 'nd', 'rd', 'th'];

	let year = date.getFullYear(); //年
	let month = monthArr[date.getMonth()]; //月
	let d_date = date.getDate(); //日

	if (d_date % 10 < 1 || d_date % 10 > 3) {
		d_date = d_date + suffix[3];
	} else if (d_date % 10 === 1) {
		d_date = d_date + suffix[0];
	} else if (d_date % 10 === 2) {
		d_date = d_date + suffix[1];
	} else {
		d_date = d_date + suffix[2];
	}
	return month + ' ' + d_date + ' ' + year;
}
/**
 * 认证标志
 * @returns {string}
 */
function get_verified_html() {
	return `<span class="verified ${b['rounded']}" 
	  style="color:${custom.verifiedBadge} !important;
		border-color:${custom.verifiedBadge} !important;">
	<span class="el_middle" style="padding-left:1.6px">Verified</span>
	<svg style="width:12px !important;height:12px !important;" t="1629104516353" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7542"><path d="M931.908267 215.466667c-127.266133-51.968-239.598933-114.688-332.612267-185.856a143.616 143.616 0 0 0-174.574933 0c-93.013333 71.150933-205.346133 133.888-332.629334 185.856a34.133333 34.133333 0 0 0-21.384533 31.5392v280.439466c0 242.722133 376.644267 496.520533 441.2928 496.520534 64.648533 0 441.2928-253.815467 441.2928-496.520534V247.005867a34.133333 34.133333 0 0 0-21.384533-31.5392zM729.463467 407.210667L471.688533 664.968533c-6.673067 6.673067-15.394133 10.001067-24.132266 10.001067s-17.4592-3.328-24.132267-10.001067l-128.887467-128.887466a34.133333 34.133333 0 1 1 48.264534-48.264534l104.7552 104.7552 233.6256-233.6256a34.133333 34.133333 0 0 1 48.2816 48.264534z" style="color:${custom.verifiedBadge}" fill=${custom.verifiedBadge} stroke="none"" p-id="7543" data-spm-anchor-id="a313x.7781069.0.i17" class="selected"></path></svg>
	</span>`;
}
/**
 * 生成一条评论的html 主题1
 * @param review_data
 * @returns {string}
 */
function get_review_html_theme_1(review_data) {
	let html_verified = '';
	let img_html = '';
	let video_html = '';
	let html_reply = '';

	if (review_data['verified'] === 1) {
		html_verified = get_verified_html();
	}
	if (review_data['images'] !== undefined) {
		for (let img of review_data['images']) {
			img_html += `<img class='media_cover ${b['me-2']} el_middle single_media max_width_100' src='${img}' alt=''/>`;
		}
	}
	if (review_data['videos'] !== undefined) {
		for (let video of review_data['videos']) {
			video_html += `<video class='media_cover ${b['me-2']} el_middle' src='${video}'></video>`;
		}
	}
	if (review_data['reply'].trim() !== '') {
		html_reply = `<div><p class="${b['pt-2']} ${b['mb-1']} ${b['mt-4']}"
		style="font-size:1em;color:${custom.replyText} !important;
		border-top: 1px solid ${custom.lineSegment} !important;">
		Merchant reply: ${review_data['reply']}</p></div>`;
	}
	let html_left_shadow =
		custom.shadow == 1
			? `<div style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;`
			: `<div style="`;
	let html_left = `border: 1px solid ${custom.lineSegment} !important; 
	border-radius: ${custom.reviewsBorderCorner}px !important;
	background: ${custom.reviewsBackground} !important;
	color:${custom.reviewsText} !important;" 
	class="${b['mb-4']} ${b['py-4']} them1-p apr-wordWrap">
<div class="${b['row']}"><div class="col-25">
<p class="${b['mb-1']}" 
style="font-size: 14px;
color:${custom.reviewsText} !important;"
>${formatDate(review_data['date'])}</p>
<p class="${b['mb-1']} ${b['fs-5']}"
	style="font-size: 18px;
	font-weight: bold;
	color:${custom.reviewsText} !important;"
	>${review_data['name']}</p>
<p class="${b['mb-1']}" 
style="font-size: 14px;
font-weight: bold;
color:${custom.reviewsText} !important;"
>${review_data['country_region']}</p>
<div class="${b['row']}">
<div class="${b['col']}">
	${get_review_star_html(parseInt(review_data['review_star_rating']))}
</div>
</div>
<div class="${b['col']}">
	${html_verified}
</div>`;
	let html_right = `</div>
	<div class="col-75">
	<p class="${b['mb-3']} review_content"
	style="color:${custom.reviewsText} !important;"
	>${review_data['content']}</p>
<p class="hide_el ${b['text-primary']} ${b['fs-6']} ${b['float-end']} theme_1_more pointer">more</p>
<p class="hide_el ${b['text-primary']} ${b['fs-6']} ${b['float-end']} theme_1_less  pointer">less</p>
${video_html}${img_html}${html_reply}</div></div></div>`;
	return html_left_shadow + html_left + html_right;
}
// class="${b['col-12']} ${b['col-sm-3']}" class="${b['col-12']} ${b['col-sm-9']} "
/**
 * 点击弹出图片和视频详情
 * @param data
 * @returns {string}
 */
function get_more_media_html(data) {
	let has_image = false;
	let has_video = false;
	media_list = [];
	if (data['images'] !== undefined) {
		for (let img of data['images']) {
			media_list.push(
				`<img src="${img}" class="max_width_100 apr-tanChuang-media" style="object-fit: contain" alt=""/>`
			);
		}
		has_image = true;
	}
	if (data['videos'] !== undefined) {
		for (let video of data['videos']) {
			media_list.push(`
            <video id="personalVideo" loop key="${Math.random()}" autoplay="true" controls="controls" controls="controls" class="apr-tanChuang-media" style="width: 100%;object-fit: contain">
                <source src="${video}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>`);
		}
		has_video = true;
	}
	if (has_image) {
		return `<div class="${b['col']}" id="show_media" style="height: 500px;display: flex;justify-content: center;background: #000;padding: 0;">
		<img src="${data['images'][0]}" class="max_width_100 apr-tanChuang-media" style="object-fit: contain" alt=""/></div>`;
	}
	if (has_video) {
		return `
		<div class="${
			b['col']
		}" id="show_media" style="height: 500px;display: flex;justify-content: center;background: #000;padding: 0;">
		<video id="personalVideo" key="${Math.random()}" autoplay="true" loop controls="controls" controls="controls" class="apr-tanChuang-media" style="width: 100%;object-fit: contain">
				<source src="${data['videos'][0]}" type="video/mp4"/>
				Your browser does not support the video tag.
            </video>
        </div>
        `;
	}
	return '';
}

window.pre_media = function () {
	current_media = (current_media - 1 + media_list.length) % media_list.length;
	document.getElementById('show_media').innerHTML = media_list[current_media];
};

window.next_media = function () {
	current_media = (current_media + 1) % media_list.length;
	document.getElementById('show_media').innerHTML = media_list[current_media];
};

function get_review_html_theme_2_media(review_data) {
	if (review_data['images'] !== undefined) {
		return `<img class="bd-placeholder-img ${b['card-img-top']} theme_2_media_cover max_width_100" src="${review_data['images'][0]}" alt=""/>`;
	}
	if (review_data['videos'] !== undefined) {
		return `<video class='bd-placeholder-img ${b['card-img-top']} theme_2_media_cover max_width_100 el_middle' src='${review_data['videos'][0]}'></video>`;
	}
	return '';
}

function theme_1_show_read_more() {
	let node_list = document.querySelectorAll('.review_content');
	for (let node of node_list) {
		if (getHeightUnfold(node) > 117) {
			node.onclick = theme_1_read_more;
			node.classList.add('theme_1_content');
			node.parentNode
				.querySelector('.theme_1_more')
				.classList.toggle('hide_el');
			node.parentNode.querySelector('.theme_1_more').onclick =
				theme_1_read_more;
			node.parentNode.querySelector('.theme_1_less').onclick =
				theme_1_read_more;
		}
	}
}

/**
 * 生成一条评论的html 主题2
 * @param review_data
 * @returns {string}
 */
function get_review_html_theme_2(review_data) {
	var elem = document.createElement('div');
	elem.className = `grid-item col-to-2 col-to-4 ${b['mb-2']} grid-item-space`;
	let html_verified = '';
	let html_reply = '';
	let html_country = '';
	if (review_data['verified'] === 1) {
		html_verified = get_verified_html();
	}
	if (review_data['reply'].trim() !== '') {
		html_reply = `<div><p class="${b['pt-2']} ${b['mb-3']} apr-replyOverflow"
		style="font-size:1em;color:${custom.replyText} !important;
		border-top: 1px solid ${custom.lineSegment} !important;">
		Merchant reply: ${review_data['reply']}</p></div>`;
	}
	if (review_data['country_region'].trim() !== '') {
		html_country = `<p class="${b['mb-1']}"
		  style="font-size: 12px;
			font-weight: bold;
			color:${custom.reviewsText} !important;">
		<svg style="width:12px !important;height:12px !important;" t="1627889773874" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1554"><path d="M512.789409 1024S156.234477 569.04777 156.234477 374.023847c0-194.989948 159.651417-353.069543 356.554932-353.069542 196.886527 0 356.527952 158.060609 356.527952 353.069542-0.001999 195.030917-356.527952 649.976153-356.527952 649.976153z m-3.699229-800.226612c-83.804229 0-151.769321 67.288599-151.769322 150.326402 0 82.991837 67.954101 150.282435 151.769322 150.282435 83.850194 0 151.785309-67.288599 151.785309-150.282435 0-83.01482-67.930119-150.326402-151.785309-150.326402z" style="color:${custom.reviewsText}" fill=${custom.reviewsText} stroke="none" p-id="1555"></path></svg>
		${review_data['country_region']}
	</p>`;
	}
	let elem_shadow =
		custom.shadow == 1
			? `<div style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;`
			: `<div style="`;
	let elem_html = `border: 1px solid ${custom.lineSegment} !important; 
	border-radius: ${custom.reviewsBorderCorner}px !important;
	background: ${custom.reviewsBackground} !important;
	color:${custom.reviewsText} !important;
	overflow: hidden;"
	class="${b['card']} ${b['m-2']}"	onclick="theme_2_read_more(this)"
	data-review-id="${review_data['review_id']}"
	>
	${get_review_html_theme_2_media(review_data)}
	<div class="${b['card-body']}" style="color:${
		custom.reviewsText
	} !important;padding:16px !important;">
		<p class="${b['mb-1']}"
			style="font-size: 12px;
			margin-top: 0px;
			font-weight: bold;
			color:${custom.reviewsText} !important;">
			${review_data['name']}
			<span class="${b['mb-1']} apr-reviewTime"
			style="font-weight: normal;color:${custom.reviewsText} !important;">
				${formatDate(review_data['date'])}
			</span>
		</p>
		${html_country}
		<div class="${b['row']} apr-reviewSvg">
			<div class="${b['col']}">
				${get_review_star_html(parseInt(review_data['review_star_rating']))}
			</div>
			<div class="${b['col']}">
				<div class="apr-reviewVerified">
					${html_verified}
				</div>
			</div>
		</div>
		<p class="theme_2_content review_content"
			style="font-size: 14px;
			margin-bottom:8px;
			color:${custom.reviewsText} !important;"
			data-status="1"
		>
			${review_data['content']}
		</p>
		<div style="clear: both; font-size: 14px" 
		class="theme_2_content">
			${html_reply}
		</div>
	</div>
</div>
`;
	elem.innerHTML = elem_shadow + elem_html;
	return elem;
}

function getHeightUnfold(dom) {
	let fakeNode = dom.cloneNode(true);
	fakeNode.style.position = 'absolute';
	// 先插入再改样式，以防元素属性在createdCallback中被添加覆盖
	dom.parentNode.insertBefore(fakeNode, dom);
	fakeNode.style.height = 'auto';
	fakeNode.style.visibility = 'hidden';

	let height = fakeNode.getBoundingClientRect().height;
	dom.parentNode.removeChild(fakeNode);

	return height;
}

function theme_1_read_more() {
	this.parentNode.querySelector('.theme_1_less').classList.toggle('hide_el');
	this.parentNode.querySelector('.theme_1_more').classList.toggle('hide_el');
	this.parentNode
		.querySelector('.review_content')
		.classList.toggle('theme_1_content');
	this.parentNode
		.querySelector('.review_content')
		.classList.toggle('underline_hover');
}

window.theme_2_read_more = function (el) {
	current_media = 0;
	let html_verified = '';
	let html_reply = '';
	let html_country = '';
	let media_html = '';
	for (let review_data of review_all) {
		if (review_data['review_id'] === el.dataset.reviewId) {
			if (review_data['verified'] === 1) {
				html_verified = get_verified_html();
			}
			if (review_data['reply'].trim() !== '') {
				html_reply = `<p class="${b['pt-2']} ${b['mt-2']} ${b['fs-12']} ${b['text-break']}"
				style="color:${custom.replyText} !important;
				border-top: 1px solid ${custom.lineSegment} !important;">
				Merchant reply: <span>${review_data['reply']}</span></p>`;
			}
			if (review_data['country_region'].trim() !== '') {
				html_country = `<span class="${b['mb-1']} 
				style="font-size: 1em;font-weight:600;color:#000;">
				<svg style="width:12px !important;height:12px !important;" t="1627889773874" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1554"><path d="M512.789409 1024S156.234477 569.04777 156.234477 374.023847c0-194.989948 159.651417-353.069543 356.554932-353.069542 196.886527 0 356.527952 158.060609 356.527952 353.069542-0.001999 195.030917-356.527952 649.976153-356.527952 649.976153z m-3.699229-800.226612c-83.804229 0-151.769321 67.288599-151.769322 150.326402 0 82.991837 67.954101 150.282435 151.769322 150.282435 83.850194 0 151.785309-67.288599 151.785309-150.282435 0-83.01482-67.930119-150.326402-151.785309-150.326402z" style="color:${custom.reviewsText}" fill=${custom.reviewsText} stroke="none" p-id="1555"></path></svg>
				${review_data['country_region']}
			</span>`;
			}
			media_html = get_more_media_html(review_data);
			add_review_media_overlay.innerHTML = `
        <div id="show_read_more" class="modal-dialog modal-margin modal-lg modal-dialog-centered ${
					b['justify-content-center']
				}">
				<svg style="width:50px !important;height:50px !important;" t="1637287546893" class="icon bi bi-chevron-compact-left ${
					b['position-absolute']
				} pointer hide_el apr-changeMedia apr-changeMedia-top apr-changeMedia-left" 
				viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1528" onclick="pre_media()">
				<path d="M640 368L592 320l-194.24 194.24 194.24 194.24 48-48-146.24-146.24L640 368z" p-id="1529" style="color:#ffffff" fill="#ffffff" stroke="none"></path>
				</svg>
				<div class="modall-content ${b['border-0']} apr-tanChuang">
					<div class="${b['row']} apr-tanChuang-direction">
						${media_html}
						<div class="${b['col']}"
						  style="color:${custom.reviewsText} !important">
							<div class="${b['mt-4']} ${b['mx-4']}">
								<div class="${b['row']}">
									<div class="${b['col']}">
										<span style="font-size: 1em;font-weight:600;">
										${review_data['name']}</span>
									</div>
									<div class="${b['col']}">
										<span style="font-size: 1em;float: right;">
											${formatDate(review_data['date'])}
										</span>
									</div>
							</div>
							${html_country}
							<div class="${b['row']}" style='display: flex;align-items: center;'>
								<div class="${b['col']}">
								${get_review_star_html(parseInt(review_data['review_star_rating']))}
                </div>
								<div class="${b['col']}">
									<span style="float: right;">${html_verified}</span>
								</div>
							</div>
						</div>
						<div style="clear: both;" class="theme_2_content_more ${b['mx-4']}">
							<p class="${b['text-break']}">
								${review_data['content']}
							</p>
              ${html_reply}
						</div>
					</div>
				</div>
			</div>
			<svg style="width:50px !important;height:50px !important;" t="1637287892152" class="icon bi bi-chevron-compact-right ${
				b['position-absolute']
			} pointer hide_el apr-changeMedia apr-changeMedia-top apr-changeMedia-right"
			 viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1723" onclick="next_media()">
			 <path d="M640 514.24L445.76 320l-48 48L544 514.24l-146.24 146.24 48 48L640 514.24z" p-id="1724" style="color:#ffffff" fill="#ffffff" stroke="none"></path>
			 </svg>
		</div>`;
			document.body.appendChild(add_review_media_overlay);
			let overlay_modal = new Modal(document.getElementById('overlay'));
			document
				.getElementById('overlay')
				.addEventListener('click', function (e) {
					e.preventDefault();
					document.getElementById('personalVideo').pause();
				});
			document
				.getElementById('show_read_more')
				.addEventListener('click', function (e) {
					e.stopPropagation();
				});
			overlay_modal.show();
			if (media_html === '') {
				document.getElementById('show_read_more').classList.toggle('modal-lg');
			}
			let image_num = 0;
			let video_num = 0;
			if ('undefined' !== typeof review_data['images']) {
				image_num = review_data['images'].length;
			}
			if ('undefined' !== typeof review_data['videos']) {
				video_num = review_data['videos'].length;
			}
			if (image_num + video_num > 1) {
				add_review_media_overlay
					.querySelector('.bi-chevron-compact-left')
					.classList.toggle('hide_el');
				add_review_media_overlay
					.querySelector('.bi-chevron-compact-right')
					.classList.toggle('hide_el');
			}
		}
	}
};

function create_masonry() {
	const m = document.querySelector('.grid-root');
	msnry = new Masonry(m, {
		itemSelector: '.grid-item',
		columnWidth: '.grid-sizer',
		percentPosition: true,
	});
	msnry.remove(m.childNodes);
	masonry_more();
	msnry.layout();
}

function masonry_more() {
	const grid = document.querySelector('.grid-root');
	var elems = [];
	var fragment = document.createDocumentFragment();
	for (let review_data of review_more) {
		var elem = get_review_html_theme_2(review_data);
		fragment.appendChild(elem);
		elems.push(elem);
	}
	grid.appendChild(fragment);
	msnry.appended(elems);
}

/**
 * 生成一页评论的html
 * @param data
 * @returns {string}
 */
function get_reviews_html(data) {
	let html = '';
	if (data['review_theme'] === 1) {
		theme_1_show_read_more();
		pagination.innerHTML = get_pagination_html();
		for (let review_data of data['reviews']) {
			html += get_review_html_theme_1(review_data);
		}
	}
	return html;
}

/*-------------------------------------------------------------翻页-------------------------------------------------------------*/

/**
 * 翻页请求评论数据
 * @param fetch_page 请求页
 * @param filter 过滤的星级
 */
function fetch_reviews(fetch_page, filter = 1) {
	document.getElementById('wait').classList.remove(`${b['d-none']}`);
	fetch(get_review_api, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shop_id: window.BOOMR.shopId,
			product_id: __st.rid,
			sorted_by: current_sort,
			filter: filter,
			request_page: fetch_page,
		}),
	})
		.then(
			res => res.json(),
			fail => {
				document.getElementById('wait').classList.add(`${b['d-none']}`);
				return fail;
			}
		)
		.then(data => {
			review_more = data['reviews'];
			document.getElementById('wait').classList.add(`${b['d-none']}`);
			let k = data;
			data_temp = k;
			current_page = fetch_page;

			total_page = parseInt(data['pages']);
			if (data['review_theme'] === 1) {
				reviews.innerHTML = get_reviews_html(data);
				expand_img();
				expand_video();
			}
			if (data_temp['review_theme'] === 2) {
				let temp = review_all.concat(data['reviews']);
				review_all = temp;
				masonry_more();
				loadmore_btn(data['reviews'].length);
			}
		});
}
/**
 * 生成分页的html
 * @returns {string}
 */
function get_pagination_html() {
	if (total_page < 1) {
		return `<p>no reviews yet</p>`;
	}
	let page_bar_2_value;
	let page_bar_3_value;
	let page_bar_4_value;
	if ((current_page === 4) & (total_page > 5)) {
		page_bar_2_value = 3;
		page_bar_3_value = 4;
		page_bar_4_value = 5;
	} else if (current_page <= 4) {
		page_bar_2_value = 2;
		page_bar_3_value = 3;
		page_bar_4_value = 4;
	} else if (current_page > total_page - 3) {
		page_bar_2_value = total_page - 3;
		page_bar_3_value = total_page - 2;
		page_bar_4_value = total_page - 1;
	} else {
		page_bar_2_value = current_page - 1;
		page_bar_3_value = current_page;
		page_bar_4_value = current_page + 1;
	}
	let previous_svg = `<svg style="width:16px !important;height:16px !important;" t="1628043278726" class="el_middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1365"><path d="M659.2 917.333333l66.133333-66.133333L386.133333 512 725.333333 172.8 659.2 106.666667 256 512z" style="color:#000000" fill="#000000" stroke="none" p-id="1366"></path></svg>`;
	let next_svg = `<svg style="width:16px !important;height:16px !important;" t="1628043402909" class="el_middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5200"><path d="M364.8 106.666667L298.666667 172.8 637.866667 512 298.666667 851.2l66.133333 66.133333L768 512z" style="color:#000000" fill="#000000" p-id="5201"></path></svg>`;
	//上一页
	let html = `<a id="apr_page_previous" class="${b['p-0']} ${b['nav-link']} ${b['me-3']} apr-page-arrow" href="javascript:void(0);" onclick="page_bar_click(this)">${previous_svg}</a>`;
	let pre_not_clickable_html = `<span id="apr_page_previous" class="${b['p-0']} ${b['nav-link']} ${b['me-3']}"></span>`;
	//下一页
	let next_clickable_html = `<a id="apr_page_next" class="${b['p-0']} ${b['nav-link']} apr-page-arrow" href="javascript:void(0);" onclick="page_bar_click(this)">${next_svg}</a>
	<input id="apr_wantToPage" type="number" />
	<button id="apr_goToPage" style="box-shadow: 0 0 0 1px transparent !important;min-width: 0px;padding: 0px;" 
	onclick="apr_goToPage()">GO</button>`;
	let next_not_clickable_html = `<span id="apr_page_next" class="${b['p-0']} ${b['nav-link']} "></span>
	<input id="apr_wantToPage" type="number" />
	<button id="apr_goToPage" style="box-shadow: 0 0 0 1px transparent !important;min-width: 0px;padding: 0px;" 
	 onclick="apr_goToPage()">GO</button>`;
	let page_bar_ellipsis = `<span class="${b['p-0']} ${b['me-3']}">···</span>`;

	let page_bar_1 = `<a class="page_bg ${b['nav-link']} ${b['me-3']}" style="color: ${custom.reviewsText} !important;line-height: 20px;"  href="javascript:void(0);" onclick="page_bar_click(this)" ">1</a>`;
	let page_bar_1_bg = `<a class="page_bg ${b['text-white']} ${b['nav-link']} ${b['me-3']}" style="background-color: ${custom.barChart} !important;line-height: 20px;" href="javascript:void(0);" onclick="page_bar_click(this)" ">1</a>`;
	if (current_page === 1) {
		pagination.setAttribute('value', 'page_bar_1');
		html = pre_not_clickable_html;
		html += page_bar_1_bg;
	} else {
		html += page_bar_1;
	}
	if (total_page === 1) {
		return html + next_not_clickable_html;
	}
	// 省略号
	if (current_page > 3 && total_page > 5) {
		html += page_bar_ellipsis;
	}
	let page_bar_2 = `<a class="page_bg ${b['nav-link']} ${b['me-3']}" style="color: ${custom.reviewsText} !important;line-height: 20px;"  href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_2_value}</a>`;
	let page_bar_2_bg = `<a class="page_bg ${b['text-white']} ${b['nav-link']} ${b['me-3']}" style="background-color: ${custom.barChart} !important;line-height: 20px;" href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_2_value}</a>`;
	if (current_page === page_bar_2_value) {
		pagination.setAttribute('value', 'page_bar_2');
		html += page_bar_2_bg;
	} else {
		html += page_bar_2;
	}
	if (total_page === 2) {
		if (total_page === current_page) {
			return html + next_not_clickable_html;
		}
		return html + next_clickable_html;
	}

	let page_bar_3 = `<a class="page_bg ${b['nav-link']} ${b['me-3']}" style="color: ${custom.reviewsText} !important;line-height: 20px;"  href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_3_value}</a>`;
	let page_bar_3_bg = `<a class="page_bg ${b['text-white']} ${b['nav-link']} ${b['me-3']}" style="background-color: ${custom.barChart} !important;line-height: 20px;" href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_3_value}</a>`;
	if (current_page === page_bar_3_value) {
		pagination.setAttribute('value', 'page_bar_3');
		html += page_bar_3_bg;
	} else {
		html += page_bar_3;
	}
	if (total_page === 3) {
		if (total_page === current_page) {
			return html + next_not_clickable_html;
		}
		return html + next_clickable_html;
	}

	let page_bar_4 = `<a class="page_bg ${b['nav-link']} ${b['me-3']}" style="color: ${custom.reviewsText} !important;line-height: 20px;"  href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_4_value}</a>`;
	let page_bar_4_bg = `<a class="page_bg ${b['text-white']} ${b['nav-link']} ${b['me-3']}" style="background-color: ${custom.barChart} !important;line-height: 20px;" href="javascript:void(0);" onclick="page_bar_click(this)" ">${page_bar_4_value}</a>`;
	if (current_page === page_bar_4_value) {
		pagination.setAttribute('value', 'page_bar_4');
		html += page_bar_4_bg;
	} else {
		html += page_bar_4;
	}
	if (total_page === 4) {
		if (total_page === current_page) {
			return html + next_not_clickable_html;
		}
		return html + next_clickable_html;
	}
	if (current_page < total_page - 2 && total_page > 5) {
		html += page_bar_ellipsis;
	}

	let page_bar_5 = `<a class="page_bg ${b['nav-link']} ${b['me-3']}" style="color: ${custom.reviewsText} !important;line-height: 20px;"  href="javascript:void(0);" onclick="page_bar_click(this)" ">${total_page}</a>`;
	let page_bar_5_bg = `<a class="page_bg ${b['text-white']} ${b['nav-link']} ${b['me-3']}" style="background-color: ${custom.barChart} !important;line-height: 20px;" href="javascript:void(0);" onclick="page_bar_click(this)" ">${total_page}</a>`;
	if (current_page === total_page) {
		pagination.setAttribute('value', 'page_bar_5');
		html += page_bar_5_bg;
		return html + next_not_clickable_html;
	} else {
		html += page_bar_5;
	}
	return html + next_clickable_html;
}
/**
 * 页面跳转事件
 */
window.apr_goToPage = function () {
	let apr_wantToPage = document.getElementById('apr_wantToPage').value;
	if (apr_wantToPage > total_page) {
		apr_wantToPage = total_page;
	} else if (apr_wantToPage < 1) {
		apr_wantToPage = 1;
	}
	current_page = parseInt(apr_wantToPage);
	fetch_reviews(current_page);
	document.getElementById('apr_wantToPage').value = '';
};
/**
 * 分页按钮被点击事件
 * @param el
 */
window.page_bar_click = function (el) {
	if (el.id === 'apr_page_previous') {
		if (current_page > 1) {
			current_page -= 1;
			fetch_reviews(current_page);
		}
	} else if (el.id === 'apr_page_next') {
		if (current_page < total_page) {
			current_page += 1;
			fetch_reviews(current_page);
		}
	} else {
		current_page = parseInt(el.text);
		fetch_reviews(current_page);
	}
};

/**
 * 插入函数
 * @param newElement
 * @param targetElement
 */
function insertAfter(newElement, targetElement) {
	if (targetElement != null) {
		let parent = targetElement.parentNode;
		if (parent.lastChild === targetElement) {
			parent.appendChild(newElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	} else {
		return;
	}
}

function get_root_div() {
	if (document.getElementById('atomee_review_app')) {
		return document.getElementById('atomee_review_app');
	}
	// 判断当前id是否为默认id，不是则插入div
	if (document.getElementById('atomeeReviewsContent')) {
		return document.getElementById('atomeeReviewsContent');
	} else if (document.getElementById('MainContent')) {
		return document.getElementById('MainContent');
	}
	if (document.querySelector('.main-content')) {
		return document.querySelector('.main-content');
	}
	return document.getElementById('atomee_review_app');
}
/**
 * 瀑布流是否创建load more按钮
 */
function loadmore_btn(el) {
	const pagination = document.getElementById('apr-pagination');
	if (!!pagination.lastChild) {
		pagination.removeChild(pagination.lastChild);
	}
	if (el === 20) {
		const more_btn = document.createElement('button');
		more_btn.setAttribute('class', `more_btn ${b['btn']} ${b['btn-primary']}`);
		more_btn.setAttribute('type', 'button');
		more_btn.setAttribute(
			'style',
			`border-radius: ${custom.buttonCorner}px !important;
			width:140px;height:40px;
			box-shadow: 0 0 0 1px transparent !important;
			color: ${custom.buttonText} !important;
    background-color: ${custom.buttonBackground} !important;
    border-color: ${custom.buttonBorder} !important;`
		);
		more_btn.setAttribute('class', `${b['btn']} ${b['btn-primary']}`);
		more_btn.innerHTML = 'Load More';
		pagination.appendChild(more_btn);
		more_btn.addEventListener('click', function () {
			get_page++;
			fetch_reviews(get_page);
		});
	} else {
		const no_more = document.createElement('p');
		no_more.setAttribute('style', 'color: #989898');
		no_more.innerHTML = 'No more reviews...';
		pagination.appendChild(no_more);
	}
}
/**
 * 页面第一次加载，所有内容渲染到MainContent的尾部
 */
function init() {
	get_xpath();
	get_page = 1;
	// 请求初始化数据
	fetch(get_review_api, {
		method: 'post',
		mode: 'cors',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			shop_id: window.BOOMR.shopId,
			product_id: __st.rid,
			sorted_by: current_sort,
			request_page: 1,
			filter: 1,
		}),
	})
		.then(
			res => res.json(),
			fail => {
				return fail;
			}
		)
		.then(data => {
			let l = data;
			data_temp = l;
			let total_stars =
				parseInt(data['five_stars']) +
				parseInt(data['four_stars']) +
				parseInt(data['three_stars']) +
				parseInt(data['two_stars']) +
				parseInt(data['one_stars']);
			total_page = parseInt(data['pages']);
			review_more = data['reviews'];
			let temp = review_all.concat(data['reviews']);
			review_all = temp;
			if(data['showStar'] == 1){
				// 往页面加入我们app的reviews header
				reviews_header.setAttribute('class', `reviewsl_header`);
				reviews_header.href = '#atomeeReviewsApp';
				reviews_header.innerHTML = get_reviews_header(
					data['avg'],
					data['total_review']
				);
				insertAfter(reviews_header, starXpathEl);
			}
			// 往页面加入我们app的reviews div
			const atomeeReviewsApp = document.createElement('div');
			atomeeReviewsApp.setAttribute('id', 'atomeeReviewsApp');
			atomeeReviewsApp.setAttribute('class', `${b['container']} ${b['p-0']}`);
			// get_root_div()
			xPathElement.appendChild(atomeeReviewsApp);
			// reviews div加入overall div
			const overall = document.createElement('div');
			overall.setAttribute(
				'class',
				`${b['row']} ${b['row-cols-1']} apr-row-cols-md-3 ${b['mx-1']} ${b['py-5']} apr-chart-nowrap`
			);
			custom.shadow == 1
				? overall.setAttribute(
						'style',
						`box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
				border: 1px solid ${custom.lineSegment} !important;
				border-radius: ${custom.reviewsBorderCorner}px !important;
				background: ${custom.reviewsBackground} !important;
				color:${custom.reviewsText} !important;
				`
				  )
				: overall.setAttribute(
						'style',
						`border: 1px solid ${custom.lineSegment} !important;
				border-radius: ${custom.reviewsBorderCorner}px !important;
				background: ${custom.reviewsBackground} !important;
				color:${custom.reviewsText} !important;
				`
				  );
			atomeeReviewsApp.appendChild(overall);

			// overall div加入overall avg div
			const overall_avg = document.createElement('div');
			overall_avg.setAttribute('class', `${b['col']}`);
			overall.appendChild(overall_avg);

			// overall avg div 加入 overall avg value

			overall_avg_value.setAttribute('class', `${b['text-center']}`);
			overall_avg_value.setAttribute('id', 'overall_avg_value');
			overall_avg_value.setAttribute(
				'style',
				'font-size:37.5pt;font-weight: Bold;background: transparent;'
			);
			overall_avg_value.innerText = parseFloat(data['avg']).toFixed(1);
			overall_avg.appendChild(overall_avg_value);

			// overall avg div 加入 overall avg stars

			overall_avg_stars.setAttribute(
				'class',
				`${b['text-center']} ${b['pt-3']}`
			);
			overall_avg_stars.setAttribute('style', 'font-size:24px;');
			overall_avg_stars.innerHTML = get_avg_stars_html(data['avg']);
			overall_avg.appendChild(overall_avg_stars);

			// overall avg div 加入 overall avg title

			overall_avg_title.setAttribute('class', `${b['text-center']}`);
			overall_avg_title.setAttribute(
				'style',
				`font-weight: 300!important;font-size:13.5pt;color:${custom.reviewsText} !important;`
			);
			overall_avg_title.innerText =
				'Based on ' + `${data['total_review']}` + ' reviews';
			overall_avg.appendChild(overall_avg_title);

			// overall div 加入 overall stars div
			const overall_stars = document.createElement('div');
			overall_stars.setAttribute(
				'class',
				`${b['col']} apr-border-start apr-border-end apr-overall-stars `
			);
			overall.appendChild(overall_stars);

			// overall stars div 加入 overall star five div
			const overall_star_five = document.createElement('div');
			overall_star_five.setAttribute(
				'class',
				`mb-12 ${b['text-center']} ${b['row']}`
			);
			overall_stars.appendChild(overall_star_five);

			// overall star five div 加入 overall star five tag
			const overall_star_five_tag = document.createElement('div');
			overall_star_five_tag.setAttribute('class', `${b['col']} ${b['pe-0']}`);
			overall_star_five_tag.innerHTML = `<span style="font-weight: Bold;font-size:10.5pt" class="${b['me-2']} el_middle">5</span><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill el_middle" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg>`;
			overall_star_five.appendChild(overall_star_five_tag);

			// overall star five div 加入 overall star five progress div

			overall_star_five_progress.setAttribute(
				'class',
				`apr-progress ${b['col-6']} ${b['ps-0']} ${b['pe-0']} ${b['align-self-center']}`
			);
			overall_star_five_progress.setAttribute(
				'style',
				`border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_five.appendChild(overall_star_five_progress);

			// overall star five progress div 加入 overall star five progress bar div

			overall_star_five_progress_bar.setAttribute('class', `apr-progress-bar`);
			overall_star_five_progress_bar.setAttribute('role', 'progressbar');
			overall_star_five_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data['five_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_five_progress_bar.setAttribute(
				'id',
				'overall_star_five_progress_bar'
			);
			overall_star_five_progress.appendChild(overall_star_five_progress_bar);

			// overall star five div 加入 overall star five value span
			overall_star_five_value.setAttribute(
				'class',
				`${b['col']} ${b['ps-0']} ${b['btn']} btn_focus_color_none ${b['pt-0']} ${b['pb-0']}  `
			);
			overall_star_five_value.setAttribute(
				'style',
				'font-size:9pt;font-weight: Bold'
			);
			overall_star_five_value.setAttribute('id', 'overall_star_value_5');
			// overall_star_five_value.onclick = stars_value_click;
			overall_star_five_value.innerText = data['five_stars'];
			overall_star_five.appendChild(overall_star_five_value);

			// overall stars div 加入 overall star four div
			const overall_star_four = document.createElement('div');
			overall_star_four.setAttribute(
				'class',
				`mb-12 ${b['text-center']} ${b['row']}`
			);
			overall_stars.appendChild(overall_star_four);

			// overall star four div 加入 overall star four tag
			const overall_star_four_tag = document.createElement('div');
			overall_star_four_tag.setAttribute('class', `${b['col']} ${b['pe-0']}`);
			overall_star_four_tag.innerHTML = `<span style="font-weight: Bold;font-size:10.5pt;" class="${b['me-2']} el_middle">4</span><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill el_middle" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg>`;
			overall_star_four.appendChild(overall_star_four_tag);

			// overall star four div 加入 overall star four progress div
			const overall_star_four_progress = document.createElement('div');
			overall_star_four_progress.setAttribute(
				'class',
				`apr-progress ${b['col-6']} ${b['ps-0']} ${b['pe-0']} ${b['align-self-center']}`
			);
			overall_star_four_progress.setAttribute(
				'style',
				`border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_four.appendChild(overall_star_four_progress);

			// overall star four progress div 加入 overall star four progress bar div

			overall_star_four_progress_bar.setAttribute('class', 'apr-progress-bar');
			overall_star_four_progress_bar.setAttribute('role', 'progressbar');
			overall_star_four_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data['four_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_four_progress_bar.setAttribute(
				'id',
				'overall_star_four_progress_bar'
			);
			overall_star_four_progress.appendChild(overall_star_four_progress_bar);

			// overall star four div 加入 overall star four value

			overall_star_four_value.setAttribute(
				'class',
				`${b['col']} ${b['ps-0']} ${b['btn']} btn_focus_color_none ${b['pt-0']} ${b['pb-0']}  `
			);
			overall_star_four_value.setAttribute(
				'style',
				'font-size:9pt;font-weight: Bold'
			);
			overall_star_four_value.setAttribute('id', 'overall_star_value_4');
			// overall_star_four_value.onclick = stars_value_click;
			overall_star_four_value.innerText = data['four_stars'];
			overall_star_four.appendChild(overall_star_four_value);

			// overall stars div 加入 overall star three div
			const overall_star_three = document.createElement('div');
			overall_star_three.setAttribute(
				'class',
				`mb-12 ${b['text-center']} ${b['row']}`
			);
			overall_stars.appendChild(overall_star_three);

			// overall star three div 加入 overall star three tag
			const overall_star_three_tag = document.createElement('div');
			overall_star_three_tag.setAttribute('class', `${b['col']} ${b['pe-0']}`);
			overall_star_three_tag.innerHTML = `<span style="font-weight: Bold;font-size:10.5pt" class="${b['me-2']} el_middle">3</span><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill el_middle" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg>`;
			overall_star_three.appendChild(overall_star_three_tag);

			// overall star three div 加入 overall star three progress div
			const overall_star_three_progress = document.createElement('div');
			overall_star_three_progress.setAttribute(
				'class',
				`apr-progress ${b['col-6']} ${b['ps-0']} ${b['pe-0']} ${b['align-self-center']}`
			);
			overall_star_three_progress.setAttribute(
				'style',
				`border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_three.appendChild(overall_star_three_progress);

			// overall star three progress div 加入 overall star three progress bar div

			overall_star_three_progress_bar.setAttribute('class', `apr-progress-bar`);
			overall_star_three_progress_bar.setAttribute('role', 'progressbar');
			overall_star_three_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data['three_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_three_progress_bar.setAttribute(
				'id',
				'overall_star_three_progress_bar'
			);
			overall_star_three_progress.appendChild(overall_star_three_progress_bar);

			// overall star three div 加入 overall star three value
			overall_star_three_value.setAttribute(
				'class',
				`${b['col']} ${b['ps-0']} ${b['btn']} btn_focus_color_none ${b['pt-0']} ${b['pb-0']}  `
			);
			overall_star_three_value.setAttribute(
				'style',
				'font-size:9pt;font-weight: Bold'
			);
			overall_star_three_value.setAttribute('id', 'overall_star_value_3');
			// overall_star_three_value.onclick = stars_value_click;
			overall_star_three_value.innerText = data['three_stars'];
			overall_star_three.appendChild(overall_star_three_value);

			// overall stars div 加入 overall star two div
			const overall_star_two = document.createElement('div');
			overall_star_two.setAttribute(
				'class',
				`mb-12 ${b['text-center']} ${b['row']}`
			);
			overall_stars.appendChild(overall_star_two);

			// overall star two div 加入 overall star two tag
			const overall_star_two_tag = document.createElement('div');
			overall_star_two_tag.setAttribute('class', `${b['col']} ${b['pe-0']}`);
			overall_star_two_tag.innerHTML = `<span style="font-weight: Bold;font-size:10.5pt" class="${b['me-2']} el_middle">2</span><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill el_middle" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg>`;
			overall_star_two.appendChild(overall_star_two_tag);

			// overall star two div 加入 overall star two progress div
			const overall_star_two_progress = document.createElement('div');
			overall_star_two_progress.setAttribute(
				'class',
				`apr-progress ${b['col-6']} ${b['ps-0']} ${b['pe-0']} ${b['align-self-center']}`
			);
			overall_star_two_progress.setAttribute(
				'style',
				`border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_two.appendChild(overall_star_two_progress);

			// overall star two progress div 加入 overall star two progress bar div

			overall_star_two_progress_bar.setAttribute('class', `apr-progress-bar`);
			overall_star_two_progress_bar.setAttribute('role', 'progressbar');
			overall_star_two_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data['two_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_two_progress_bar.setAttribute(
				'id',
				'overall_star_two_progress_bar'
			);
			overall_star_two_progress.appendChild(overall_star_two_progress_bar);

			// overall star two div 加入 overall star two value

			overall_star_two_value.setAttribute(
				'class',
				`${b['col']} ${b['ps-0']} ${b['btn']} btn_focus_color_none ${b['pt-0']} ${b['pb-0']}  `
			);
			overall_star_two_value.setAttribute(
				'style',
				'font-size:9pt;font-weight: Bold'
			);
			overall_star_two_value.setAttribute('id', 'overall_star_value_2');
			// overall_star_two_value.onclick = stars_value_click;
			overall_star_two_value.innerText = data['two_stars'];
			overall_star_two.appendChild(overall_star_two_value);

			// overall stars div 加入 overall star one div
			const overall_star_one = document.createElement('div');
			overall_star_one.setAttribute(
				'class',
				`mb-12 ${b['text-center']} ${b['row']}`
			);
			overall_stars.appendChild(overall_star_one);

			// overall star one div 加入 overall star one tag
			const overall_star_one_tag = document.createElement('div');
			overall_star_one_tag.setAttribute('class', `${b['col']} ${b['pe-0']}`);
			overall_star_one_tag.innerHTML = `<span style="font-weight: Bold;font-size:10.5pt" class="${b['me-2']} el_middle">1</span><svg style="width:16px !important;height:16px !important;" xmlns="http://www.w3.org/2000/svg" class="bi bi-star-fill el_middle" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" style="color:${custom.star}" fill=${custom.star} stroke="none"/></svg>`;
			overall_star_one.appendChild(overall_star_one_tag);

			// overall star one div 加入 overall star one progress div
			const overall_star_one_progress = document.createElement('div');
			overall_star_one_progress.setAttribute(
				'class',
				`apr-progress ${b['col-6']} ${b['ps-0']} ${b['pe-0']} ${b['align-self-center']}`
			);
			overall_star_one_progress.setAttribute(
				'style',
				`border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_one.appendChild(overall_star_one_progress);

			// overall star one progress div 加入 overall star one progress bar div

			overall_star_one_progress_bar.setAttribute('class', `apr-progress-bar`);
			overall_star_one_progress_bar.setAttribute('role', 'progressbar');
			overall_star_one_progress_bar.setAttribute(
				'style',
				'width: ' +
					Number((data['one_stars'] / total_stars) * 100).toFixed(1) +
					`%;background-color:${custom.barChart} !important;
					border-radius: ${custom.barChartCorner}px !important`
			);
			overall_star_one_progress_bar.setAttribute(
				'id',
				'overall_star_one_progress_bar'
			);
			overall_star_one_progress.appendChild(overall_star_one_progress_bar);

			// overall star one div 加入 overall star one value

			overall_star_one_value.setAttribute(
				'class',
				`${b['col']} ${b['ps-0']} ${b['btn']} btn_focus_color_none ${b['pt-0']} ${b['pb-0']}  `
			);
			overall_star_one_value.setAttribute(
				'style',
				'font-size:9pt;font-weight: Bold'
			);
			overall_star_one_value.setAttribute('id', 'overall_star_value_1');
			// overall_star_one_value.onclick = stars_value_click;
			overall_star_one_value.innerText = data['one_stars'];
			overall_star_one.appendChild(overall_star_one_value);

			// overall 加入 add review div
			const overall_add_review = document.createElement('div');
			overall_add_review.setAttribute(
				'class',
				`${b['col']} ${b['align-self-center']} ${b['text-center']}`
			);
			overall_add_review.innerHTML = `<button type="button" style="
			width:140px;height:40px;
			font-size:14px;
			border-radius: ${custom.buttonCorner}px !important;
			color: ${custom.buttonText} !important;
			background-color: ${custom.buttonBackground} !important;
			border-color: ${custom.buttonBorder} !important;
			box-shadow: 0 0 0 1px transparent !important;"
			  id="add_review_btn" class="${b['btn']} ${b['btn-primary']}" data-bs-toggle="collapse" data-bs-target="#add_review">Add reviews</button>`;
			overall.appendChild(overall_add_review);

			//add review
			const add_review = document.createElement('div');
			add_review.setAttribute('id', 'add_review');
			add_review.setAttribute('class', `collapse`);
			add_review.setAttribute(
				'style',
				`background-color: ${custom.buttonBackground}1A !important;
				border-radius: ${custom.reviewsBorderCorner}px !important;
				text-align: start;`
			);
			atomeeReviewsApp.appendChild(add_review);

			// add review hide div 加入 add review
			const add_review_hide = document.createElement('div');
			add_review_hide.setAttribute(
				'class',
				`${b['btn']} ${b['pt-0']} ${b['pb-0']} ${b['bg-light']} ${b['text-center']}`
			);
			add_review_hide.setAttribute('data-bs-toggle', `collapse`);
			add_review_hide.setAttribute('data-bs-target', '#add_review');
			add_review_hide.setAttribute(
				'style',
				'height: auto; width: 100%;display:block;'
			);
			add_review_hide.innerHTML = ``;
			add_review.appendChild(add_review_hide);

			// add review content div 加入 add review
			const add_review_content = document.createElement('div');
			add_review_content.setAttribute(
				'class',
				`${b['row']} ${b['m-5']} ${b['mb-3']} ${b['justify-content-center']} ${b['justify-content-around']}`
			);
			add_review.appendChild(add_review_content);

			// add review content left star 加入 add review content
			add_review_content_left_star.setAttribute(
				'class',
				`${b['align-self-center']} ${b['d-flex']} ${b['flex-wrap']}`
			);
			add_review_content_left_star.innerHTML =
				get_review_content_left_star_html();
			add_review_content.appendChild(add_review_content_left_star);

			// add review content left 加入 add review content
			const add_review_content_left = document.createElement('div');
			add_review_content_left.setAttribute('class', `apr-col-md-6`);
			add_review_content.appendChild(add_review_content_left);

			// add review content left name 加入 add review content
			const add_review_content_left_name = document.createElement('div');
			add_review_content_left_name.setAttribute('class', `${b['mb-3']}`);
			add_review_content_left_name.innerHTML = `<div style="font-size:13.5pt;font-weight:600" class="${b['form-label']}">Name:</div><input class="${b['form-controll']}" id="name" type="text" placeholder="Fill in your name" style="border: 1px solid #ced4da;"><p class="${b['text-danger']} hide_el" id="name_alert">The maximum number of characters is 32</p>`;
			add_review_content_left.appendChild(add_review_content_left_name);
			let name_text = document.getElementById('name');
			name_text.addEventListener('input', function () {
				if (name_text.value.length === 0 || /^\s+$/gi.test(name_text.value)) {
					document.getElementById('name').classList.add('danger');
					name_text_is_checked = false;
				} else if (name_text.value.length > 32) {
					document.getElementById('name').classList.add('danger');
					document.getElementById('name_alert').classList.remove('hide_el');
					name_text_is_checked = false;
				} else {
					document.getElementById('name_alert').classList.add('hide_el');
					document.getElementById('name').classList.remove('danger');
					name_text_is_checked = true;
				}
			});

			// add review content right 加入 add review content
			const add_review_content_right = document.createElement('div');
			add_review_content_right.setAttribute(
				'class',
				`apr-col-md-6 ${b['justify-content-center']}`
			);
			add_review_content.appendChild(add_review_content_right);

			// add review content left country_region 加入 add review content right
			add_review_content_left_area.setAttribute('class', `${b['mb-4']}`);
			add_review_content_left_area.innerHTML = `<div style="font-size:13.5pt;font-weight:600" class="${b['form-label']}">Country(Optional):</div><select class="${b['form-select']}" id="country_region" name="value"><option selected disabled style="display:none;" value="">Select a country or region</option><option value="Afghanistan">Afghanistan</option><option value="&Aring;land Islands">&Aring;land Islands</option><option value="Albania">Albania</option><option value="Algeria">Algeria</option><option value="American Samoa">American Samoa</option><option value="Andorra">Andorra</option><option value="Angola">Angola</option><option value="Anguilla">Anguilla</option><option value="Antarctica">Antarctica</option><option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option><option value="Argentina">Argentina</option><option value="Armenia">Armenia</option><option value="Aruba">Aruba</option><option value="Australia">Australia</option><option value="Austria">Austria</option><option value="Azerbaijan">Azerbaijan</option><option value="Bahamas">Bahamas</option><option value="Bahrain">Bahrain</option><option value="Bangladesh">Bangladesh</option><option value="Barbados">Barbados</option><option value="Belarus">Belarus</option><option value="Belgium">Belgium</option><option value="Belize">Belize</option><option value="Benin">Benin</option><option value="Bermuda">Bermuda</option><option value="Bhutan">Bhutan</option><option value="Bolivia">Bolivia</option><option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option><option value="Botswana">Botswana</option><option value="Bouvet Island">Bouvet Island</option><option value="Brazil">Brazil</option><option value="British Indian Ocean Territory">British Indian Ocean Territory</option><option value="British Virgin Islands">British Virgin Islands</option><option value="Brunei">Brunei</option><option value="Bulgaria">Bulgaria</option><option value="Burkina Faso">Burkina Faso</option><option value="Burundi">Burundi</option><option value="Cambodia">Cambodia</option><option value="Cameroon">Cameroon</option><option value="Canada">Canada</option><option value="Cape Verde">Cape Verde</option><option value="Caribbean Netherlands">Caribbean Netherlands</option><option value="Cayman Islands">Cayman Islands</option><option value="Central African Republic">Central African Republic</option><option value="Chad">Chad</option><option value="Chile">Chile</option><option value="China">China</option><option value="Christmas Island">Christmas Island</option><option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option><option value="Colombia">Colombia</option><option value="Comoros">Comoros</option><option value="Congo - Brazzaville">Congo - Brazzaville</option><option value="Congo - Kinshasa">Congo - Kinshasa</option><option value="Cook Islands">Cook Islands</option><option value="Costa Rica">Costa Rica</option><option value="C&ocirc;te d&rsquo;Ivoire">C&ocirc;te d&rsquo;Ivoire</option><option value="Croatia">Croatia</option><option value="Cuba">Cuba</option><option value="Cura&ccedil;ao">Cura&ccedil;ao</option><option value="Cyprus">Cyprus</option><option value="Czechia">Czechia</option><option value="Denmark">Denmark</option><option value="Djibouti">Djibouti</option><option value="Dominica">Dominica</option><option value="Dominican Republic">Dominican Republic</option><option value="Ecuador">Ecuador</option><option value="Egypt">Egypt</option><option value="El Salvador">El Salvador</option><option value="Equatorial Guinea">Equatorial Guinea</option><option value="Eritrea">Eritrea</option><option value="Estonia">Estonia</option><option value="Eswatini">Eswatini</option><option value="Ethiopia">Ethiopia</option><option value="Falkland Islands">Falkland Islands</option><option value="Faroe Islands">Faroe Islands</option><option value="Fiji">Fiji</option><option value="Finland">Finland</option><option value="France">France</option><option value="French Guiana">French Guiana</option><option value="French Polynesia">French Polynesia</option><option value="French Southern Territories">French Southern Territories</option><option value="Gabon">Gabon</option><option value="Gambia">Gambia</option><option value="Georgia">Georgia</option><option value="Germany">Germany</option><option value="Ghana">Ghana</option><option value="Gibraltar">Gibraltar</option><option value="Greece">Greece</option><option value="Greenland">Greenland</option><option value="Grenada">Grenada</option><option value="Guadeloupe">Guadeloupe</option><option value="Guam">Guam</option><option value="Guatemala">Guatemala</option><option value="Guernsey">Guernsey</option><option value="Guinea">Guinea</option><option value="Guinea-Bissau">Guinea-Bissau</option><option value="Guyana">Guyana</option><option value="Haiti">Haiti</option><option value="Heard &amp; McDonald Islands">Heard &amp; McDonald Islands</option><option value="Honduras">Honduras</option><option value="Hong Kong SAR China">Hong Kong SAR China</option><option value="Hungary">Hungary</option><option value="Iceland">Iceland</option><option value="India">India</option><option value="Indonesia">Indonesia</option><option value="Iran">Iran</option><option value="Iraq">Iraq</option><option value="Ireland">Ireland</option><option value="Isle of Man">Isle of Man</option><option value="Israel">Israel</option><option value="Italy">Italy</option><option value="Jamaica">Jamaica</option><option value="Japan">Japan</option><option value="Jersey">Jersey</option><option value="Jordan">Jordan</option><option value="Kazakhstan">Kazakhstan</option><option value="Kenya">Kenya</option><option value="Kiribati">Kiribati</option><option value="Kuwait">Kuwait</option><option value="Kyrgyzstan">Kyrgyzstan</option><option value="Laos">Laos</option><option value="Latvia">Latvia</option><option value="Lebanon">Lebanon</option><option value="Lesotho">Lesotho</option><option value="Liberia">Liberia</option><option value="Libya">Libya</option><option value="Liechtenstein">Liechtenstein</option><option value="Lithuania">Lithuania</option><option value="Luxembourg">Luxembourg</option><option value="Macao SAR China">Macao SAR China</option><option value="Madagascar">Madagascar</option><option value="Malawi">Malawi</option><option value="Malaysia">Malaysia</option><option value="Maldives">Maldives</option><option value="Mali">Mali</option><option value="Malta">Malta</option><option value="Marshall Islands">Marshall Islands</option><option value="Martinique">Martinique</option><option value="Mauritania">Mauritania</option><option value="Mauritius">Mauritius</option><option value="Mayotte">Mayotte</option><option value="Mexico">Mexico</option><option value="Micronesia">Micronesia</option><option value="Moldova">Moldova</option><option value="Monaco">Monaco</option><option value="Mongolia">Mongolia</option><option value="Montenegro">Montenegro</option><option value="Montserrat">Montserrat</option><option value="Morocco">Morocco</option><option value="Mozambique">Mozambique</option><option value="Myanmar (Burma)">Myanmar (Burma)</option><option value="Namibia">Namibia</option><option value="Nauru">Nauru</option><option value="Nepal">Nepal</option><option value="Netherlands">Netherlands</option><option value="New Caledonia">New Caledonia</option><option value="New Zealand">New Zealand</option><option value="Nicaragua">Nicaragua</option><option value="Niger">Niger</option><option value="Nigeria">Nigeria</option><option value="Niue">Niue</option><option value="Norfolk Island">Norfolk Island</option><option value="North Korea">North Korea</option><option value="North Macedonia">North Macedonia</option><option value="Northern Mariana Islands">Northern Mariana Islands</option><option value="Norway">Norway</option><option value="Oman">Oman</option><option value="Pakistan">Pakistan</option><option value="Palau">Palau</option><option value="Palestinian Territories">Palestinian Territories</option><option value="Panama">Panama</option><option value="Papua New Guinea">Papua New Guinea</option><option value="Paraguay">Paraguay</option><option value="Peru">Peru</option><option value="Philippines">Philippines</option><option value="Pitcairn Islands">Pitcairn Islands</option><option value="Poland">Poland</option><option value="Portugal">Portugal</option><option value="Puerto Rico">Puerto Rico</option><option value="Qatar">Qatar</option><option value="R&eacute;union">R&eacute;union</option><option value="Romania">Romania</option><option value="Russia">Russia</option><option value="Rwanda">Rwanda</option><option value="Samoa">Samoa</option><option value="San Marino">San Marino</option><option value="S&atilde;o Tom&eacute; &amp; Pr&iacute;ncipe">S&atilde;o Tom&eacute; &amp; Pr&iacute;ncipe</option><option value="Saudi Arabia">Saudi Arabia</option><option value="Senegal">Senegal</option><option value="Serbia">Serbia</option><option value="Seychelles">Seychelles</option><option value="Sierra Leone">Sierra Leone</option><option value="Singapore">Singapore</option><option value="Sint Maarten">Sint Maarten</option><option value="Slovakia">Slovakia</option><option value="Slovenia">Slovenia</option><option value="Solomon Islands">Solomon Islands</option><option value="Somalia">Somalia</option><option value="South Africa">South Africa</option><option value="South Georgia &amp; South Sandwich Islands">South Georgia &amp; South Sandwich Islands</option><option value="South Korea">South Korea</option><option value="South Sudan">South Sudan</option><option value="Spain">Spain</option><option value="Sri Lanka">Sri Lanka</option><option value="St. Barth&eacute;lemy">St. Barth&eacute;lemy</option><option value="St. Helena">St. Helena</option><option value="St. Kitts &amp; Nevis">St. Kitts &amp; Nevis</option><option value="St. Lucia">St. Lucia</option><option value="St. Martin">St. Martin</option><option value="St. Pierre &amp; Miquelon">St. Pierre &amp; Miquelon</option><option value="St. Vincent &amp; Grenadines">St. Vincent &amp; Grenadines</option><option value="Sudan">Sudan</option><option value="Suriname">Suriname</option><option value="Svalbard &amp; Jan Mayen">Svalbard &amp; Jan Mayen</option><option value="Sweden">Sweden</option><option value="Switzerland">Switzerland</option><option value="Syria">Syria</option><option value="Taiwan">Taiwan</option><option value="Tajikistan">Tajikistan</option><option value="Tanzania">Tanzania</option><option value="Thailand">Thailand</option><option value="Timor-Leste">Timor-Leste</option><option value="Togo">Togo</option><option value="Tokelau">Tokelau</option><option value="Tonga">Tonga</option><option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option><option value="Tunisia">Tunisia</option><option value="Turkey">Turkey</option><option value="Turkmenistan">Turkmenistan</option><option value="Turks &amp; Caicos Islands">Turks &amp; Caicos Islands</option><option value="Tuvalu">Tuvalu</option><option value="U.S. Outlying Islands">U.S. Outlying Islands</option><option value="U.S. Virgin Islands">U.S. Virgin Islands</option><option value="Uganda">Uganda</option><option value="Ukraine">Ukraine</option><option value="United Arab Emirates">United Arab Emirates</option><option value="United Kingdom">United Kingdom</option><option value="United States">United States</option><option value="Uruguay">Uruguay</option><option value="Uzbekistan">Uzbekistan</option><option value="Vanuatu">Vanuatu</option><option value="Vatican City">Vatican City</option><option value="Venezuela">Venezuela</option><option value="Vietnam">Vietnam</option><option value="Wallis &amp; Futuna">Wallis &amp; Futuna</option><option value="Western Sahara">Western Sahara</option><option value="Yemen">Yemen</option><option value="Zambia">Zambia</option><option value="Zimbabwe">Zimbabwe</option></select>`;
			add_review_content_right.appendChild(add_review_content_left_area);
			document
				.getElementById('country_region')
				.addEventListener('change', function () {
					document.getElementById('country_region').style.color = '#000000';
				});
			// add review content right text 加入 add review content
			const add_review_content_right_text = document.createElement('div');
			add_review_content_right_text.setAttribute(
				'class',
				`${b['mb-3']} ${b['mt-2']}`
			);
			add_review_content_right_text.setAttribute('style', 'position:relative');
			add_review_content_right_text.innerHTML = `<textarea style="border: 1px solid #ced4da;height:170pt;resize:none;margin-bottom:-6px;" class="${b['form-controll']}" maxlength="1500" id="review_text" rows="5" placeholder="Enter your feedback here..."></textarea><p id="limitFont" style="position:absolute;bottom:0;right:2vw;color:#979797">0-1500 characters</p>`;
			add_review_content.appendChild(add_review_content_right_text);
			let review_text = document.getElementById('review_text');
			// 字数显示
			review_text.addEventListener('input', function (params) {
				if (
					review_text.value.length === 0 ||
					/^\s+$/gi.test(review_text.value)
				) {
					document.getElementById('review_text').classList.add('danger');
					review_text_is_checked = false;
				} else {
					document.getElementById('review_text').classList.remove('danger');
					review_text_is_checked = true;
					// 添加实时展示填入数量
					let m = review_text.value.length;
					const limitFont = document.getElementById('limitFont');
					limitFont.innerText = m + '-1500 characters';
				}
			});

			if (data['apr_billing_plan'] !== 0) {
				// 添加Image/Video
				const image_video_font = document.createElement('span');
				image_video_font.setAttribute('class', 'image_video_font');
				image_video_font.innerText = 'Image/Video';
				insertAfter(image_video_font, add_review_content_right_text);
				// add review content right image 加入 add review content
				add_review_content_right_image.setAttribute(
					'class',
					`image_video ${b['d-flex']} ${b['flex-wrap']} ${b['justify-content-start']}`
				);
				add_review_content_right_image.setAttribute('id', 'medias');
				add_review_content_right_image.innerHTML =
					get_review_content_right_media_html();
				add_review_content.appendChild(add_review_content_right_image);
			}

			// add review publish div 加入 add review
			const add_review_publish = document.createElement('div');
			add_review_publish.setAttribute(
				'class',
				`${b['btn']} ${b['btn-primary']} rounded-top-0`
			);
			add_review_publish.setAttribute(
				'style',
				`width: 100%;
				border-radius:0 0 ${custom.reviewsBorderCorner}px ${custom.reviewsBorderCorner}px !important;
				color: ${custom.buttonText} !important;
				background-color: ${custom.buttonBackground} !important;
				border-color: ${custom.buttonBorder} !important;`
			);
			add_review_publish.setAttribute('onclick', 'publish()');
			add_review_publish.innerText = 'Publish';
			add_review.appendChild(add_review_publish);

			// preview
			add_review_media_overlay.setAttribute('id', 'overlay');
			add_review_media_overlay.setAttribute('class', 'modal1 modal1-bg');
			add_review_media_overlay.setAttribute('style', 'ma');
			// add_review_media_overlay.setAttribute('data-bs-backdrop', 'static');
			add_review_media_overlay.setAttribute('data-bs-keyboard', 'false');
			add_review_media_overlay.setAttribute('tabindex', '-1');

			// navbar
			const navbar = document.createElement('nav');
			navbar.setAttribute(
				'class',
				`${b['nav']} ${b['pt-2']} navbar-my navbar-style`
			);
			navbar.setAttribute('id', 'sort');
			atomeeReviewsApp.appendChild(navbar);

			// sort
			navbar_sort.setAttribute('id', 'navbar_sort');
			navbar_sort.setAttribute('value', 'navbar_most_recent');
			navbar.appendChild(navbar_sort);

			// recent
			navbar_most_recent.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} ${b['text-dark']} ${b['border-2']}`
			);
			navbar_most_recent.setAttribute(
				'style',
				`border-bottom: 5px solid ${custom.barChart} !important;`
			);
			navbar_most_recent.setAttribute('id', 'navbar_most_recent');
			navbar_most_recent.setAttribute('onclick', 'sort_click(this)');
			navbar_most_recent.setAttribute('onmouseover', 'sort_onmouseover(this)');
			navbar_most_recent.setAttribute('onmouseout', 'sort_onmouseout(this)');
			navbar_most_recent.innerText = 'Recent';
			navbar_most_recent.href = 'javascript:void(0);';
			navbar.appendChild(navbar_most_recent);

			// Image/Video
			navbar_image_video.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
			);
			navbar_image_video.setAttribute('id', 'navbar_image_video');
			navbar_image_video.setAttribute('onclick', 'sort_click(this)');
			navbar_image_video.setAttribute('onmouseover', 'sort_onmouseover(this)');
			navbar_image_video.setAttribute('onmouseout', 'sort_onmouseout(this)');
			navbar_image_video.innerText = 'Image/Video';
			navbar_image_video.href = 'javascript:void(0);';
			navbar.appendChild(navbar_image_video);

			// Highest Rating
			navbar_highest_rating.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
			);
			navbar_highest_rating.setAttribute('id', 'navbar_highest_rating');
			navbar_highest_rating.setAttribute('onclick', 'sort_click(this)');
			navbar_highest_rating.setAttribute(
				'onmouseover',
				'sort_onmouseover(this)'
			);
			navbar_highest_rating.setAttribute('onmouseout', 'sort_onmouseout(this)');
			navbar_highest_rating.innerText = 'Highest Rating';
			navbar_highest_rating.href = 'javascript:void(0);';
			navbar.appendChild(navbar_highest_rating);

			// Lowest Rating
			navbar_lowest_rating.setAttribute(
				'class',
				`${b['nav-link']} ${b['p-0']} ${b['pb-1']} navbar-ms ${b['text-dark']}`
			);
			navbar_lowest_rating.setAttribute('id', 'navbar_lowest_rating');
			navbar_lowest_rating.setAttribute('onclick', 'sort_click(this)');
			navbar_lowest_rating.setAttribute(
				'onmouseover',
				'sort_onmouseover(this)'
			);
			navbar_lowest_rating.setAttribute('onmouseout', 'sort_onmouseout(this)');
			navbar_lowest_rating.innerText = 'Lowest Rating';
			navbar_lowest_rating.href = 'javascript:void(0);';
			navbar.appendChild(navbar_lowest_rating);
			if (data['apr_billing_plan'] !== 1) {
				const navbar_logo = document.createElement('span');
				navbar_logo.setAttribute(
					'class',
					`${b['ms-auto']}   ${b['p-0']} ${b['pb-1']}`
				);
				navbar_logo.setAttribute('id', 'navbar_logo');
				navbar_logo.innerText = 'Powered by atomee';
				navbar.appendChild(navbar_logo);
			}

			// reviews
			reviews.setAttribute('id', 'apr-reviews');
			reviews.setAttribute('class', 'apr-reviews');
			atomeeReviewsApp.appendChild(reviews);
			//pagination
			pagination.setAttribute(
				'class',
				`${b['nav']} ${b['justify-content-center']} ${b['align-self-center']} ${b['m-2']}`
			);
			pagination.setAttribute('style', `font-size:14px;align-items: center;`);
			pagination.setAttribute('id', 'apr-pagination');
			pagination.setAttribute('value', 'page_bar_1');
			atomeeReviewsApp.appendChild(pagination);
			if (data['review_theme'] === 1) {
				reviews.innerHTML = get_reviews_html(data);
				expand_img();
				expand_video();
			}
			if (data['review_theme'] === 2) {
				const grid = document.createElement('div');
				grid.setAttribute('class', 'grid-root');
				reviews.appendChild(grid);
				//新建grid-sizer
				const grid_sizer = document.createElement('div');
				grid_sizer.setAttribute('class', 'grid-sizer');
				grid.appendChild(grid_sizer);
				//瀑布流
				create_masonry();

				//新建按钮
				loadmore_btn(data['reviews'].length);
			}
		});
}

// 线上专用，判断是否是商品页。只在商品页展示评论
if ('undefined' !== typeof __st) {
	if ('undefined' !== typeof __st.rid) {
		get_ip();
		setTimeout(() => {
			init();
		}, 1000);
		// window.onload = init();
		// window.onload = get_ip();
	}
}
// 插入星级
// fetch_star();
// setInterval(() => {
// 	fetch_star();
// }, 1000);
//获取自定义样式
get_custom();

// 插入星级（移动到获取自定义样式成功之后）
// setTimeout(() => {
// 	fetch_star();
// }, 1000);
// window.onload = fetch_star();
// window.onload = fetch_stars_status();

//获取谷歌星级展示开关状态
fetch_stars_status();