/*********************
  vp幅に応じて viewportメタタグの内容を動的に変更
  **********************/
!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  function switchViewport() {
    const value =
      window.outerWidth > 375
        ? 'width=device-width,initial-scale=1' //window.outerWidthが375pxより大きい場合、value変数に'width=device-width,initial-scale=1' を設定
        : 'width=375'; //それ以外の場合は'width=375'を設定
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  addEventListener('resize', switchViewport, false);
  switchViewport();
})();


/*********************
a要素、button要素をクリック後に自動でフォーカスを外す
(クリックした後もa要素が:focus状態のままになるのを防ぐため)
**********************/
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('click', function () {
    this.blur();
  });
});


/*********************
FVを過ぎたらヘッダー出現
**********************/
const mv = document.querySelector(".fv");
const header = document.querySelector(".js-header");

if (mv && header) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        // FVが画面から出たらクラス付与
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    },
    {
      rootMargin: "-30px 0px 0px 0px", //viewportの上端から30px内側に食い込ませる
    }
  );

  observer.observe(mv);
}


/*********************
タブメニュー
**********************/
document.addEventListener('DOMContentLoaded', function () {
  // ページ内の全タブグループを取得
  const tabGroups = document.querySelectorAll('.tab-group');

  tabGroups.forEach(function (group) {
    // このタブグループ内だけのタブとコンテンツを取得
    // (ページ全体から取らないことで、他のタブグループへの干渉を防ぐ)
    const tabs = group.querySelectorAll('.tab');
    const contents = group.querySelectorAll('.content');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // クリックされたタブのdata-tab属性値を取得(例: "01"）
        const targetKey = tab.dataset.tab;

        // --- タブボタン側の切り替え ---
        // 一旦すべてのタブから is-active を外し、aria-selected も false に
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        // クリックされたタブだけ is-active を付与し、aria-selected を true に
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        // --- コンテンツ側の切り替え ---
        // data-tab属性がクリックされたタブと一致するコンテンツだけ表示
        contents.forEach(function (c) {
          const isMatch = c.dataset.tab === targetKey;
          c.classList.toggle('is-display', isMatch);
        });
      });
    });
  });
}, false);


/*********************
スライダ― (Swiper使用)
**********************/
const mySwiper = new Swiper('.swiper', {
  // オプション設定

  // loop: true, // ループ再生(有効にすると最後のスライドの次に1枚目へ戻る。※スライド枚数が少ないと表示が不自然になることがあるので要確認)

  // ページネーション
  pagination: {
    el: '.swiper-pagination',   // ページネーション(ドット)を表示する要素
    clickable: true,             // ドットをクリック/タップして該当スライドへ直接移動できるようにする
  },

  // 矢印
  navigation: {
    nextEl: '.my-next', // 「次へ」矢印ボタンの要素 ※独自要素を使用する場合こちらのクラスを変更
    prevEl: '.my-prev', // 「前へ」矢印ボタンの要素  ※独自要素を使用する場合こちらのクラスを変更
  },

  // スクロールバー
  // scrollbar: {
  //   el: '.swiper-scrollbar', // スクロールバー(ドラッグでスライド送りできるバー)を表示する要素
  // },
});


/*********************
price-list要素を右にスクロールしたら.price-list__scroll要素をフェードアウトさせる
**********************/
const priceList = document.querySelector(".price-list");
const scrollIcon = document.querySelector(".price-list__scroll");

priceList.addEventListener("scroll", () => {
  if (priceList.scrollLeft > 20) {
    scrollIcon.style.opacity = "0";
    // transitionが終わった後にdisplay:noneにしたい場合
    scrollIcon.addEventListener("transitionend", () => {
      scrollIcon.style.display = "none";
    }, { once: true });
  }
});


/*********************
  アコーディオンメニュー
*********************/
// 初期状態:最初のアコーディオンを開いておく場合
$('.accordion__box').first()
  .addClass('is-active')
  .find('.accordion__content')
  .show(); // または .css('display', 'block');
// ----- //

$('.accordion__title').on('click', function () {

  const $title = $(this);
  const $box = $title.closest('.accordion__box');
  const $content = $title.next('.accordion__content');

  // 開いたら他のアコーディオンを閉じる場合
  $('.accordion__box').not($box).each(function () {
    $(this).removeClass('is-active')
      .find('.accordion__content')
      .slideUp(400);
  });

  // 自分のアコーディオンを開閉
  $content.slideToggle(400);
  $box.toggleClass('is-active');
});


/*********************
  ページトップボタン
*********************/
document.addEventListener('DOMContentLoaded', () => {
  const pageTop = document.querySelector('.js-pagetop');

  // スクロール量がブラウザの表示領域の高さ（= FVの高さ）を超えたらボタンを表示
  // FV内に戻ったら非表示（FVがheight: 100vh以外の場合は数値を直接指定）
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      pageTop.classList.add('is-shown');
    } else {
      pageTop.classList.remove('is-shown');
    }
  });

  // クリックでページ最上部へスムーズスクロール
  pageTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});



/*********************
FV 画像クロスフェードアニメーション
*********************/
const items = document.querySelectorAll('.js-slideshow-item');
let current = 0;

setInterval(() => {
  items[current].classList.remove('is-active');
  current = (current + 1) % items.length; // 最後の次は0に戻る
  items[current].classList.add('is-active');
}, 4000); // 表示時間（ms）※cssの.slideshow__itemにつけるtransition 1sより長くすること


/*********************
FV 背景色が伸びてテキストを表示させるアニメーション
※ FV専用:ページ読込時にのみ発火。スクロール監視なし
*********************/
function bgFadeAnimeOnLoad() {
  document.querySelectorAll('.js-bgLRextendTrigger').forEach((el) => {
    el.classList.add('bgLRextend');
  });
  document.querySelectorAll('.js-bgappearTrigger').forEach((el) => {
    el.classList.add('bgappear');
  });
}

window.addEventListener('load', bgFadeAnimeOnLoad);


/*********************
スクロールに付随して要素をフェードイン
**********************/
// ページ読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer の設定
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      // 要素がビューポート内に入ったかどうか（trueなら見えている）
      if (entry.isIntersecting) {
        // CSSアニメーションを発火させるクラスを付与
        entry.target.classList.add('is-inview');

        // アニメーションが終わったら監視を外す（繰り返し発火しないように）
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null, // ビューポートを基準に監視
    rootMargin: '0px 0px -10%', // 画面下の35%分を発火対象から除外して、少しスクロールしてから反応する
    threshold: 0 // 要素が1pxでも見えたら判定
  });

  // すべての .animate 要素を監視対象に追加
  document.querySelectorAll('.js-inview').forEach((el) => {
    observer.observe(el);
  });
});