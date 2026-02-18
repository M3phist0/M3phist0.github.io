window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) { // [CHANGED] 防御性：避免为空时报错
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    var options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
    bulmaSlider.attach();

    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
})

/* =========================================================
   Compare Slider (2 columns) + Arrow Scene Switch (4 videos)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // [KEEP] scenes：一个场景 = 两个 slider（slot0/slot1）= 4个视频
  // =========================================================
  const scenes = [
    {
      // Scene UPPER
      sliders: [
        { left: "static/videos/depth/upper.mp4", right: "static/videos/rgb/upper.mp4" },       // slot 0（左列）
        { left: "static/videos/mesh/upper.mp4",  right: "static/videos/texture/upper.mp4" }    // slot 1（右列）
      ]
    },
    {
      // Scene SMBU
      sliders: [
        { left: "static/videos/depth/smbu.mp4", right: "static/videos/rgb/smbu.mp4" },    // slot 0
        { left: "static/videos/mesh/smbu.mp4", right: "static/videos/texture/smbu.mp4" }  // slot 1
      ]
    },
    {
      // Scene LFLS
      sliders: [
        { left: "static/videos/depth/lfls.mp4", right: "static/videos/rgb/lfls.mp4" },    // slot 0
        { left: "static/videos/mesh/lfls.mp4", right: "static/videos/texture/lfls.mp4" } // slot 1
      ]
    },
    {
      // Scene Rubble
      sliders: [
        { left: "static/videos/depth/rubble.mp4", right: "static/videos/rgb/rubble.mp4" },    // slot 0
        { left: "static/videos/mesh/rubble.mp4", right: "static/videos/texture/rubble.mp4" } // slot 1
      ]
    },
    {
      // Scene Aerial
      sliders: [
        { left: "static/videos/depth/aerial.mp4", right: "static/videos/rgb/aerial.mp4" },    // slot 0
        { left: "static/videos/mesh/aerial.mp4", right: "static/videos/texture/aerial.mp4" } // slot 1
      ]
    }
  ];

  // =========================================================
  // [KEEP] sceneIndex：只保留这一份（不要再在别处重新 let sceneIndex）
  // =========================================================
  let sceneIndex = 0;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // =========================================================
  // [KEEP] dots 相关变量（必须和 scenes/updateScene 在同一作用域）
  // =========================================================
  const dotsContainer = document.getElementById("scene-dots");
  let dotButtons = [];

  function updateActiveDot() {
    if (!dotButtons.length) return;
    dotButtons.forEach((b, i) => b.classList.toggle("is-active", i === sceneIndex));
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    dotButtons = scenes.map((_, i) => {
      const btn = document.createElement("button");
      btn.className = "scene-dot";
      btn.type = "button";
      btn.setAttribute("aria-label", `Go to scene ${i + 1}`);

      btn.addEventListener("click", () => {
        sceneIndex = i;
        updateScene(sceneIndex);   // ✅ dots 点击切场景
      });

      dotsContainer.appendChild(btn);
      return btn;
    });

    updateActiveDot();
  }

  // =========================================================
  // [KEEP] compare slider 拖动：多组件版本（.js-compare）
  // =========================================================
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function setPercent(wrapper, percent) {
    const rightVideo = wrapper.querySelector(".video-right");
    const handle = wrapper.querySelector(".compare-handle");
    const p = clamp(percent, 0, 100);
    if (!rightVideo || !handle) return;

    handle.style.left = `${p}%`;
    rightVideo.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
  }

  function pointerToPercent(wrapper, clientX) {
    const rect = wrapper.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    return (x / rect.width) * 100;
  }

  document.querySelectorAll(".js-compare").forEach((wrapper) => {
    setPercent(wrapper, 50);

    let dragging = false;
    const handle = wrapper.querySelector(".compare-handle");
    if (!handle) return;

    handle.addEventListener("pointerdown", (e) => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });

    wrapper.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      setPercent(wrapper, pointerToPercent(wrapper, e.clientX));
    });

    wrapper.addEventListener("pointerup", () => { dragging = false; });
    wrapper.addEventListener("pointercancel", () => { dragging = false; });

    wrapper.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".compare-handle")) return;
      setPercent(wrapper, pointerToPercent(wrapper, e.clientX));
      dragging = true;
      wrapper.setPointerCapture(e.pointerId);
    });
  });

  // =========================================================
  // [NEW] 等待视频 ready：用于“4个视频一起开始播放”
  // - loadeddata/canplay 任一触发就算 ready
  // - timeout 防止卡死
  // =========================================================
  function waitVideoReady(videoEl, timeoutMs = 6000) {
    return new Promise((resolve) => {
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        cleanup();
        resolve(true);
      };

      const cleanup = () => {
        videoEl.removeEventListener("loadeddata", finish);
        videoEl.removeEventListener("canplay", finish);
        videoEl.removeEventListener("error", finish);
        clearTimeout(timer);
      };

      // 已经 ready 直接放行
      if (videoEl.readyState >= 2) { // HAVE_CURRENT_DATA
        resolve(true);
        return;
      }

      videoEl.addEventListener("loadeddata", finish, { once: true });
      videoEl.addEventListener("canplay", finish, { once: true });
      videoEl.addEventListener("error", finish, { once: true });

      const timer = setTimeout(() => {
        cleanup();
        resolve(false); // 超时也放行
      }, timeoutMs);
    });
  }

  // =========================================================
  // [CHANGED] setVideoSource：只换源+load，不在这里 play
  // 原因：统一等4个都 ready 后一起 play
  // =========================================================
  function setVideoSource(videoEl, src) {
    const source = videoEl.querySelector("source");
    if (!source) return;

    // 切场景时先停掉，保证视觉一致
    videoEl.pause();

    // 可选：每次从头开始（如果你不想从头，删掉下一行）
    videoEl.currentTime = 0;

    // 如果 src 不同才更新
    if (source.getAttribute("src") !== src) {
      source.setAttribute("src", src);
    }

    // 更积极预取
    videoEl.preload = "auto";
    videoEl.load();
  }

  // =========================================================
  // [CHANGED] updateScene：切换 4 个视频 + 同步 dots
  // - 先全部换源+load
  // - 等4个都 ready（或超时）
  // - 再一起 play，避免不整齐
  // =========================================================
  async function updateScene(idx) {
    const wrappers = document.querySelectorAll(".js-compare");
    const allVideos = []; // [NEW] 收集4个视频做 barrier

    wrappers.forEach((wrapper) => {
      const slot = parseInt(wrapper.dataset.slot, 10); // 0 or 1
      const cfg = scenes[idx]?.sliders?.[slot];
      if (!cfg) return;

      const vLeft = wrapper.querySelector(".video-left");
      const vRight = wrapper.querySelector(".video-right");
      if (!vLeft || !vRight) return;

      setVideoSource(vLeft, cfg.left);
      setVideoSource(vRight, cfg.right);

      allVideos.push(vLeft, vRight);

      // 可选：切场景重置拖动条
      setPercent(wrapper, 50);
    });

    // [NEW] 等待所有视频至少能渲染首帧（或超时放行）
    await Promise.all(allVideos.map(v => waitVideoReady(v, 6000)));

    // [NEW] 同步播放（尽量在同一 tick 触发）
    allVideos.forEach(v => {
      v.play().catch(() => {});
    });

    // ✅ 同步 dots（关键）
    updateActiveDot();
  }

  // =========================================================
  // [KEEP] 初始化顺序：先画 dots，再切场景
  // =========================================================
  renderDots();
  updateScene(sceneIndex);

  // =========================================================
  // [KEEP/CHANGED] 绑定箭头：切场景 + 自动同步 dots
  // =========================================================
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      sceneIndex = (sceneIndex - 1 + scenes.length) % scenes.length;
      updateScene(sceneIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      sceneIndex = (sceneIndex + 1) % scenes.length;
      updateScene(sceneIndex);
    });
  }

});



/* =========================================================
   [REMOVED] 旧版全局 scenes + video-left/right 绑定（id 版本）
   你之前文件末尾那段会在新结构下失效/冲突，所以删除
   ---------------------------------------------------------
   const scenes = [...]
   const videoLeft = document.getElementById("video-left");
   const videoRight = document.getElementById("video-right");
   ...
   ========================================================= */