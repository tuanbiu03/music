const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const heading=$('header h2')
const cdthumb=$('.cd-thumb')
const audio=$('#audio')

const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')

const playlist=$('.playlist')

const PLAYER_STORAGE_KEY='QUANNDB'

const app ={
    currentIndex: 0,
    isPlaying: false,
    isRandom:  false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    //list songs
    songs:[
        {
            name: 'love08',
            singer: 'duonggg',
            image: 'https://i.ytimg.com/vi/6MqlA6KeMMo/maxresdefault.jpg',
            path: './mp3/love08.mp3'
        },
        {
            name: 'Hơi ảo',
            singer: 'Tuấn bỉu',
            image: 'https://i.ytimg.com/vi/sknOBFSmOv4/maxresdefault.jpg',
            path: './mp3/hoiao.mp3'
        },
        {
            name: 'All i ask',
            singer: 'Tuấn bỉu',
            image: 'https://ict-imgs.vgcloud.vn/2022/01/10/23/coin-cho-shiba-inu-va-nhung-dieu-can-biet-trong-nam-2022.jpg',
            path: './mp3/aia.mp3'
        },
        {
            name: 'lost',
            singer: 'obito',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2020/09/24/5/9/f/e/1600916104086_640.jpg',
            path: './mp3/lost.mp3'
        },
        {
            name: 'moonlight',
            singer: 'ariana grande',
            image: 'https://happymag.tv/wp-content/uploads/2022/03/The-Quarry-logo-870x524.jpg',
            path: './mp3/moonlight.mp3'
        },
        {
            name: 'VCNCKNTĐ',
            singer: 'GreyD x tlinh',
            image: 'https://i.ytimg.com/vi/2iidlwQ-NfU/maxresdefault.jpg',
            path: './mp3/vc.mp3'
        },
        {
            name: 'ta còn đây',
            singer: 'Justatee x Rhymastic',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/a/e/d/6/aed68e51237ad706f2a5c45d089ee525.jpg',
            path: './mp3/tcd.mp3'
        },
        {
            name: 'Ghost',
            singer: 'Justin Bieber',
            image: 'https://i1.sndcdn.com/artworks-qefDi0LXjvwVrAKJ-W9Ixsw-t500x500.jpg',
            path: './mp3/ghost.mp3'
        },
        {
            name: 'chúng ta đã từng có nhau',
            singer: 'LIL Z Poet',
            image: 'https://lyricvn.com/wp-content/uploads/2021/11/65dc1a9b418217d2b23ca86c7792f541.jpg',
            path: './mp3/ct.mp3'
        },
        {
            name: 'Bình nguyên vô tận',
            singer: 'PHO LO REN TI NO',
            image: 'https://lvgames.net/lvgames_wallpapers_app/wall/florentino%20giam%20sat%20tinh%20he%20aov.jpg',
            path: './mp3/binhnguyen.mp3'
        }
    ],
    setConfig: function(key,value){
        this.config[key]=value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    //render view
    render: function(){
        const htmls= this.songs.map((song,index)=>{
            return`
            <div class="song ${index===this.currentIndex ? 'active':''}" data-index="${index}">
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
        playlist.innerHTML=htmls.join('')
    },

    //defineProperties
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    
    //handle
    handleEvents: function(){
        const _this=this
        //cdThumb
        const cd=$('.cd')
        const cdwidth=cd.offsetWidth
        document.onscroll = function(){
            const scrolltop=window.scrollY || document.documentElement.scrollTop
            const newWidth=cdwidth-scrolltop
            cd.style.width= newWidth >0 ? newWidth+'px' : 0;
            cd.style.opacity= newWidth/cdwidth;
        }
        //clickPlay
        const playBtn=$('.btn-toggle-play')
        const player=$('.player')
        /////////////////////////////////
        const cdThumbAnimate=cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        ////////////////////////////
        playBtn.onclick=function(){
            if(_this.isPlaying){              
                audio.pause()     
            }else{
                audio.play()
            }
        }
        audio.onplay=function(){
             player.classList.add('playing')
             _this.isPlaying=true
             cdThumbAnimate.play()
        }
        audio.onpause=function(){
            _this.isPlaying=false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //position of song
        audio.ontimeupdate=function(){
            let audioDuaration=audio.duration
            const progress=$('.progress')
            if(audio.duration){
               const progressPercent=(audio.currentTime*100/audioDuaration)
               progress.value=(progressPercent)
               progress.style.backgroundSize=(progressPercent)+'%'
            }
        }
        //seek
        progress.onchange=function(e){
            const seekTime=audio.duration*e.target.value/100
            audio.currentTime=seekTime
        }

        //nextSong
        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomsong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.handlePlaylist()

        }
        //prevSong
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomsong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.handlePlaylist()

        }
        //random
        randomBtn.onclick=function(){
            _this.isRandom=!_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('random', _this.isRandom)
        }
        //repeat
        repeatBtn.onclick=function(){
            _this.isRepeat=!_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
            _this.setConfig('repeat',_this.isRepeat)
        }      
        //onended
        audio.onended=function(){
            if(_this.isRepeat){
                _this.playRepeatsong()
            }else{
                nextBtn.click()
            }
        }
        //click into playlist
        playlist.onclick= function(e){
            const songNode=e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                if(songNode){
                    /////////////////////////////////////////////////////////////////////////////
                    //songNode.getAttribute('data-index') || songNode.dataset.index
                    /////////////////////////////////////////////////////////////////////////////
                    _this.currentIndex=Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')){
                    console.log(123)
                }
            }
        }
    },

    //loadCurrentSong
    loadCurrentSong: function(){
        heading.textContent= this.currentSong.name
        cdthumb.style.backgroundImage= `url('${this.currentSong.image}')`
        audio.src= this.currentSong.path

    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex>=this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
        this.render()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0){
            this.currentIndex=this.songs.length-1
        }
        this.loadCurrentSong()
        this.render()
    },
    playRandomsong: function(){
        let newIndex=Math.floor(Math.random()*this.songs.length)
        while(newIndex===this.currentIndex){
            newIndex=Math.floor(Math.random()*this.songs.length)
        }
        this.currentIndex=newIndex
        this.loadCurrentSong()
        this.render()
    },
    playRepeatsong: function(){
        audio.play()
    },

    handlePlaylist: function(){
        // $('.song.active').classList.remove('active')
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },100)
    },

    loadConfig: function(){
        this.isRepeat=this.config.repeat
        this.isRandom=this.config.random
        if(!this.isRandom){
            this.isRandom=false
        }
        if(!this.isRepeat){
            this.isRepeat=false
        }
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom)
    },

    //run app
    start: function(){
        this.loadConfig()

        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()  


    }
}

app.start()