const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playList = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex : 0,
    isPlaying :false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: "Gato",
            singer: "SpaceSpeaker",
            path: "./assets/music/music1.mp3",
            image: "./assets/image/image1.jpg"
        },
        {
            name: "Ân cần",
            singer: "Bray",
            path: "./assets/music/music2.mp3",
            image: "./assets/image/image2.jpg"
        },
        {
            name: "Ân xá",
            singer: "Bray",
            path: "./assets/music/music3.mp3",
            image: "./assets/image/image3.jpg"
        },
        {
            name: "Truyện cổ grimm",
            singer: "MC ILL",
            path: "./assets/music/music4.mp3",
            image: "./assets/image/image4.jpg"
        },
        {
            name: "Ức chế",
            singer: "Karik",
            path: "./assets/music/music5.mp3",
            image: "./assets/image/image5.jpg"
        },
        {
            name: "Baby get my gun",
            singer: "Richchoi",
            path: "./assets/music/music6.mp3",
            image: "./assets/image/image6.jpg"
        },
        {
            name: "Ếch báo dissin",
            singer: "Rhymastic",
            path: "./assets/music/music7.mp3",
            image: "./assets/image/image7.jpg"
        }
    ],
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý cd quay và dưng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 second
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //xử lí phóng to thu nhỏ cd
        document.onscroll = function(){ 
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px': 0
            cd.style.opacity = newcdWidth / cdWidth
        }
        //xử click play
        playBtn.onclick = function(){
            if(_this.isPlaying == true){
                audio.pause()
                
            }else{
                audio.play()
            }
        }
        //khi bài hát đang play
        audio.onplay = function(){
            player.classList.add('playing')
            _this.isPlaying = true
            cdThumbAnimate.play()
        }

        audio.onpause = function(){
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function(){
            let progressPercent = Math.floor(audio.currentTime/audio.duration*100)
            progress.value = progressPercent
        }
        //xử lý khi tua
        progress.onchange = function(e){
            let currentPercent = e.target.value
            audio.currentTime = currentPercent/100*audio.duration
        }
        //bấm nút next và prev
        nextBtn.onclick = function(){  
            if(_this.isRandom){
                _this.randomSong()
                audio.play()
            }else{
                _this.nextSong()
                audio.play()
            }
            _this.render()
            _this.scrollActiveSong()
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
                audio.play()
            }else{
                _this.prevSong()
                audio.play()
            }
            _this.render()
            _this.scrollActiveSong()
        }

        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        //xử lý phát lại một bài hát khi nó hết
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        
        //Xử lý lắng nghe sự click vào playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(e.target.closest('.song:not(active)')){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                //
                if(e.target.closest('.option')){
                    
                }
            }
        }
        //xử lý next song bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                _this.loadCurrentSong()
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }
    },
    loadCurrentSong: function(){
        song = this.currentSong
        heading.innerText = song.name
        cdThumb.style.backgroundImage = `url('${song.image}')`
        audio.src = song.path

    },  
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <= 0){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        var newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollActiveSong: function(){
        let blockProperty = 'nearest'
        if(this.currentIndex == 1 || this.currentIndex == 2){
            
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: blockProperty
            })
        }, 100);
    },

    render:function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    start: function(){
        //định nghĩa các thuộc tính cho Obj
        this.defineProperties();
        //lắng nghe các sự kiện
        this.handleEvents();
        //tải thông tin bài hát đầu tiên
        this.loadCurrentSong();
        //render giao diện
        this.render();
    }
}

app.start()