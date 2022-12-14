
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelector.bind(document)
    
    const PLAYER_STORAGE_KEY = 'F8_PLAYER'

    const player = $('.player')
    const cd = $('.cd')    
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const progress = $('#progress')
    const prevBtn = $('.btn-prev')
    const nextBtn = $('.btn-next')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $(".playlist");

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
                name: 'Save Your Tears',
                singer: 'The Weeknd',
                path:'./assets/music/1.mp3',
                image:'./assets/img/1.jpg'
            },
            {
                name: 'Die For You',
                singer: 'The Weeknd',
                path:'./assets/music/2.webm',
                image:'./assets/img/2.jpg'
            },
            {
                name: 'The Hills',
                singer: 'The Weeknd',
                path:'./assets/music/3.mp3',
                image:'./assets/img/3.jpg'
            },
            {
                name: 'How Do I Make You Love Me?',
                singer: 'The Weeknd',
                path:'./assets/music/4.mp3',
                image:'./assets/img/4.jpg'
            },
            {
                name: 'BBi BBi',
                singer: 'The Weeknd',
                path:'./assets/music/5.mp3',
                image:'./assets/img/5.jpg'
            },
            {
                name: 'Blinding Lights',
                singer: 'The Weeknd',
                path:'./assets/music/6.mp3',
                image:'./assets/img/6.jpg'
            },
            {
                name: 'In Your Eyes',
                singer: 'The Weeknd',
                path:'./assets/music/7.mp3',
                image:'./assets/img/7.jpg'
            },
            {
                name: 'Take Me Back To LA',
                singer: 'The Weeknd',
                path:'./assets/music/8.mp3',
                image:'./assets/img/8.jpg'
            },
            {
                name: 'Hold Your Heart',
                singer: 'The Weeknd',
                path:'./assets/music/9.mp3',
                image:'./assets/img/9.jpg'
            },
            {
                name: 'The Source',
                singer: 'The Weeknd',
                path:'./assets/music/10.mp3',
                image:'./assets/img/10.jpg'
            }
        ],      
        setConfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        render: function(){
            const html = this.songs.map((song, index) =>{
                return `
                <div class="song ${index === this.currentIndex ? 'active' : ' '}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image} ');">
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
            playlist.innerHTML = html.join('')
        },
        defineProperties: function(){
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex]
                }
            })
        },
        handleEvents: function() {
            const _this = this
            const cdWidth = cd.offsetWidth

            // X??? l?? CD quay / d???ng
           const cdThumdAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 100000, //10 seconds
                iterations: Infinity
            })
            cdThumdAnimate.pause()

            //X??? l?? ph??ng to thu nh??? CD
            document.onscroll = function() {
                const scrollTop = window.scrollY
                const newCdWidth = cdWidth - scrollTop

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth /cdWidth
            }

            //X??? l?? khi click play
            playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                }else{
                audio.play()
                } 
            }

            //Khi song ???????c play
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumdAnimate.play()
            }

            //Khi song b??? pause 
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumdAnimate.pause()
            }

            //Khi ti???n ????? b??i h??t thay ?????i
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            
            //X??? l?? khi tua song
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }

            //Khi next song
            nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

            //Khi prev song
            prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

            //X??? l?? b???t/t???t random
            randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)
                
            }

            //X??? l?? l???p l???i m???t song
            repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }

            //X??? l?? next song khi audio ended
            audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
            
            //L???ng nghe h??nh vi click v??o playlist
            playlist.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)')
                if (songNode  || e.target.closest('.option')) {
                        //X??? l?? khi click v??o song
                        if (songNode){
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            audio.play()
                            _this.render()
                        }

                        //X??? l?? khi click v??o song option
                        if (e.target.closest('.option')){

                        }
                }
            }
        },
        scrollToActiveSong: function() {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }, 500)
        },
        loadCurrentSong: function() {

            heading.textContent = this.currentSong.name 
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
        },
        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },
        nextSong: function() {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0 
            }
            this.loadCurrentSong()
        },
        prevSong: function() {
            this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        },
        playRandomSong: function() {
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex)

            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
        start: function(){
            //G??n c???u h??nh t??? config v??o ???ng d???ng
            this.loadConfig()
            //?????nh ngh??a c??c thu???c t??nh cho oject
            this.defineProperties()

            //L???ng nghe v?? x??? l?? c??c s??? ki???n
            this.handleEvents()

            //T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
            this.loadCurrentSong()

            //Render playlist
            this.render()

            //Hi???n th??? tr???ng th??i ban ?????u c???a button repeat & random
            repeatBtn.classList.toggle('active', this.isRepeat)
            randomBtn.classList.toggle('active', this.isRandom)
        }
    }
    app.start()    
    