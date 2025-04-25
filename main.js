// loading song
const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const PLAYER_STORAGE = 'F8-Player'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const replayBtn = $('.btn-repeat')
const songsBtn = $('.song')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setConfig:function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    songs: [
        {
            namesong:"Bắt Cóc Con Tim",
            singer:"Lou Hoàng",
            path:"./asset/music/Bắt Cóc Con Tim - Lou Hoàng x Quanvrox「Lofi Ver.」- Official Lyrics Video.mp3",
            image:"./asset/img/batococcontim.jpg"
        },
        {
            namesong:"Ai chung tình được mãi",
            singer:"Đinh Tùng Huy",
            path:"./asset/music/AI CHUNG TÌNH ĐƯỢC MÃI - ĐINH TÙNG HUY - OFFICIAL MUSIC VIDEO.mp4",
            image:"./asset/img/dinhtunghuy.jpg"
        },
        {
            namesong:"Cho gần anh thêm chút nữa",
            singer:"Hương Tràm",
            path:"./asset/music/CHO EM GẦN ANH THÊM CHÚT NỮA - TRÁI TIM EM VÀ DÒNG MÁU NÓNG NAM MILO REMIX NHẠC HOT TIKTOK 2022.mp3",
            image:"./asset/img/huongtram.jpg"
        },
        {
            namesong:"Cảm ơn vì tất cả",
            singer:"Anh Quân Idol",
            path:"./asset/music/Đâu là nơi cô ấy đến mỗi khi thấy buồn... Cảm Ơn Vì Tất Cả I Nhạc Lofi Chill Hot TikTok 2022.mp3",
            image:"./asset/img/c270eb7dd0e8b6b2e46e7b8efb3a1362_1422523976.jpg"
        },
        {
            namesong:"Thế giới mất đi một người",
            singer:"Tăng Phúc",
            path:"./asset/music/THẾ GIỚI MẤT ĐI MỘT NGƯỜI - TĂNG PHÚC.mp3",
            image:"./asset/img/tang phuc.png"
        },
        {
            namesong:"Em ơi",
            singer:"Vũ Cát Tường",
            path:"./asset/music/Vũ Cát Tường ft. Hakoota - Em Ơi (Official MV) - Valentine Song.mp3",
            image:"./asset/img/em ơi.jpg"
        },
        {
            namesong:"Trời giấu trời mang đi",
            singer:"AMEE & VIRUSS",
            path:"./asset/music/TRỜI GIẤU TRỜI MANG ĐI - AMEE x VIRUSS - Lyrics.mp3",
            image:"./asset/img/1571713207648_640.jpg"
        },
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.namesong}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('\n')
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.namesong
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        
    },
    prevSong: function(){
        if(this.isRandom)
        {
            this.randomSong()
        }
        else {
            this.currentIndex--
            if(this.currentIndex < 0)
            {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        }
    },
    nextSong: function(){
        if(this.isRandom)
        {
            this.randomSong()
        } else {
            this.currentIndex++
            if(this.currentIndex <= this.songs.length)
            {
                this.currentSong = 0
            }
            this.loadCurrentSong()
        }
    },
    randomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    defineProperties: function() { 
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 500);
    },
    handleScroll: function() {
        const _this = this //this này có  tác dụng trỏ đến giá trị bên ngoài
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop

            cd.style.width =newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }
        // xử lí click vô nút play/pause chơi nhạc
        playBtn.onclick = function() {
            if(_this.isPlaying)
            {
                audio.pause()
            } else { 
                audio.play()
            }
        }
        //Đĩa xoay vòng tròn
        //Liên quan đến thuộc tính animate, đọc thêm doc về animate
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // quay 10s
            iterations: Infinity // số lần lặp lại
        })
        cdAnimate.pause()

        //Khi song được play
        audio.onplay = function() {
            player.classList.add('playing')
            _this.isPlaying = true
            cdAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function() {
            player.classList.remove('playing')
            _this.isPlaying = false
            cdAnimate.pause()
        }
        //Thanh tiến trình thay đổi theo tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) 
            {
                const progressPresent = Math.floor(audio.currentTime / audio.duration * 100) 
                progress.value = progressPresent
            }
        }
        //khi bài hát hết tự lặp lại
        audio.onended = function() {
            if(_this.isRepeat)
            {
                audio.play()
            }
            else
            {
                nextBtn.click()
            }

        }
        //Bấm tua bài hát
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //click Next song
        nextBtn.onclick = function() {
            if(_this.isRandom)
            {
                _this.randomSong()
            }
            else 
            {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //click Previous song
        prevBtn.onclick = function() {
            if(_this.isRandom)
            {
                _this.randomSong()
            }
            else 
            {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //click randomSong
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        
        // click resetSong
        replayBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            replayBtn.classList.toggle('active', _this.isRepeat)
        }
        songsBtn.onclick = function() {
            console.log("songsBtn clicked")
        }
        // click playlistSong thì load song lên
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(e.target.closest('.song:not(.active)') || e.target.closest('.option'))
            {
                if(e.target.closest('.song:not(.active)'))
                {
                    //dùng dataset để lấy ra cái index của nó
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                if( e.target.closest('.option')) 
                {

                }
            }
        }
    },

    start: function(){
        this.currentIndex = 0
        //load config
        this.loadConfig()
        //lấy bài hát hiện tại
        this.defineProperties()
        // xử lí các thao tác DOM Event
        this.handleScroll()

        // Tải thông tin bài hát lên 
        this.loadCurrentSong()

        // render ra bài hát mới trên playlist
        this.render()
        
        randomBtn.classList.toggle('active', this.isRandom)
        replayBtn.classList.toggle('active', this.isRepeat)
    },
}
app.start()