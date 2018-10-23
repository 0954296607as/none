//преобразование градусы в радиан
const GRAD_TO_RAD=[361];
const RAD_TO_GRAD=[361];
//
const X1=screen.availWidth;
const Y1=screen.availHeight;
//
const X2=Math.round(X1/2);
const Y2=Math.round(Y1/2);
var my_Stars, my_Stars2, my_Stars3=[];
var content= document.getElementById('canvas');




function install (){
   
// starting massives of degreese and radians   
    for (let index = 0; index<361; index++){
          GRAD_TO_RAD[index]=index*0.0175;       
    }
    for (let index = 0; index<361; index++){
            RAD_TO_GRAD[index]=Math.round (GRAD_TO_RAD[index]/0.0175);
        }
    
    can=content.getContext('2d');
// create stars' massive in polare cordinates
    my_Stars=create_stars(20);
    my_Stars2=create_stars(20);
    my_Stars3=create_stars(20); 

}
// getting cordinates in the canvas style
function convert(xy,center_x,center_y){
    let x,y;
    this.center_x=center_x||X2;
    this.center_y=center_y||Y2;
    
    x=(xy[0]<this.center_x ? this.center_x-xy[0] : this.center_x+xy[0]);

    y=(xy[1]<this.center_y ? this.center_y-xy[1] : this.center_y+xy[1]);
    return [x,y];
}
//Polar coordinate.
function polar_to_decarte (len, a){

    let x=Math.round(len*Math.cos(GRAD_TO_RAD[a]));
    let y=Math.round(len*Math.sin(GRAD_TO_RAD[a]));

    
    return [x,y];

}
//рисуем точку в полярных координатах
function plot_polar (len, a, center_x, center_y, big){
    let xy=convert( polar_to_decarte(len,a), center_x, center_y);
    can.beginPath();    
    can.fillStyle='white';
    can.fillRect (xy[0],  xy[1], big, big);
    //can.stroke();
                 


    }
//создаем массив звезд
    function create_stars(qt){
    var stars=[];
    this.qt = qt*2;    
    for (let i=0; i<this.qt ; ++i){
        let len=Math.round(Math.random()*100);
        let a=Math.round(Math.random()*360);
        stars[i]=len;
        stars[++i]=a;
    }
    return stars;

}

//вычисление координат
function animate(mass, speed){
    this.speed=speed || 1;
    let len=mass.length;
    let mass_new=[];
    for(let i=0; i<len; i++){
        mass_new[i]=(mass[i]+this.speed);
        mass_new[++i]=mass[i];
    }
    return mass_new;
}
// проверка массива на принадлежность размерам канваса
function check(mass){
    let len=mass.length;
    let mass_new=mass;
    let temp=[];
    for(let i=0; i<len; i++ ){
        let xy=convert(polar_to_decarte(mass_new[i], mass_new[++i]));
        if((xy[0]<=0) || (xy[0]>=X1) || (xy[1]<=0) || (xy[1]>=Y1)){
           xy=create_stars(1);
           temp.push(xy[0]);
           temp.push(xy[1]);
        }else{
            temp[--i]=mass_new[i++];
            temp[i]=mass_new[i];
        }
    }
    return temp;
}

//
function make_plot_mas(mass, center_x ,center_y, big){
    let len=mass.length;
    for (let i=0; i<len; i++){
        plot_polar(mass[i], mass[++i], center_x, center_y, big);
    }
}

install();
setInterval(loop,20);


function loop(){


    can.clearRect(0,0,X1,Y1);
    make_plot_mas(my_Stars,X2,Y2, 1);
    make_plot_mas(my_Stars2,X2,Y2, 2);
    make_plot_mas(my_Stars3,X2,Y2, 3);
    
    my_Stars= animate(my_Stars, 1);
    my_Stars2=animate(my_Stars2, 3);
    my_Stars3=animate(my_Stars3, 5);
    
    my_Stars= check(my_Stars);
    my_Stars2=check(my_Stars2);
    my_Stars3=check(my_Stars3);

    
}


