const ajax=new Ajax();
let price_table={}, id, collection={}, color;
let arr=[];
let price_pigments={};
//запуск при загрузке страницы
onload=()=>{ 
    creat_list(product, $('#product'));
    $('#product').focus();
    ajax.send_get('pigments',(data)=>{
        for (const iterator of JSON.parse (data)) {
            price_pigments[iterator.product_id]=iterator.price;
        }
    });
    

}

$('#packing').onchange=function(){
    let dom=this.children[this.selectedIndex].textContent;
    p_product(dom);
    make_atm();
    make_total();
}
$('#collections').onchange=function(){
    delete_lists($('#color'));
    make_colors($('#collections').children[this.selectedIndex].textContent);
}
$('#color').onchange=function(){
    color=$('#color').children[this.selectedIndex].textContent;
    ajax.send_post({'product':id,
                    'color':color},'recipes',(data)=>{
                        create_recipes(data);
                    });
}

$('#product').onchange=function(){

    if(this.selectedIndex!=0){
        if ($('#packing').childElementCount==0){
            $('#packing').style.display='block';
        }else{
            delete_lists ($('#packing'));
            price_table={};
        }
        id=(product[this.children[this.selectedIndex].textContent]);
        let obj={'product':id};
    
        ajax.send_post(obj,'price',(data)=>{

            data.forEach(element => {
                let hello=element.packing+' '+element.packing_size;
                price_table[hello]=element.price;
            });
            creat_list(price_table,$('#packing'));
            p_product($('#packing').children[0].textContent);
            make_collections();
    
                   
        })
    }
    
}
function p_product(data){
    $('#p_product').innerHTML=price_table[data];
}
function make_colors(collection){
    if ($('#color').childElementCount==0){
        $('#color').style.display='block';
    }else{
        delete_lists($('#color'));
    }
    create_colors(collections[collection],$('#color'));
    color=$('#color').children[0].textContent;
    ajax.send_post({'product':id,
                    'color': color},'recipes',(data)=>{
                        create_recipes(data);
                    });
    
}
function make_collections(){
    let obj={'product':id}

    if ($('#collections').style.display==0) {
        $('#collections').style.display='block';
    }else{
        delete_lists($('#collections'));
    }
    collections={};
    ajax.send_post(obj,'collection',(data)=>{
        data.forEach(val=>{
            if(!(val.collection_name in collections)){
                collections[val.collection_name]=[];
            }
            collections[val.collection_name].push(val.color_number);
        });
    
    
        creat_list(collections, $('#collections'));
        make_colors($('#collections').children[0].textContent);
    });
}
function creat_list(data, which=new Element()){
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let new_option=document.createElement('option');
            new_option.innerHTML=key;
            which.appendChild(new_option);

            
        }
    }
  
}
function create_colors(data, which=new Element()){
    data.forEach((val)=>{
        let new_option=document.createElement('option');
            new_option.innerHTML=val;
            which.appendChild(new_option);
    });
}
function delete_lists(node){
    while (node.lastChild){
        node.lastChild.remove();
    }
}
function create_recipes(recipes){
    arr=[];
    recipes.forEach(vals=>{
        $('#pigment1').innerHTML=name_ingredient(vals.ingredient_1);
        $('#pigment2').innerHTML=name_ingredient(vals.ingredient_2);
        $('#pigment3').innerHTML=name_ingredient(vals.ingredient_3);
        $('#pigment4').innerHTML=name_ingredient(vals.ingredient_4);
        arr.push(vals.atm_1);
        arr.push(vals.atm_2);
        arr.push(vals.atm_3);
        arr.push(vals.atm_4);
        $('#price_1').innerHTML=(vals.atm_1)? Math.round (1000*price_pigments[vals.ingredient_1]/1000)/1000: null;
        $('#price_2').innerHTML=(vals.atm_2)? Math.round (1000*price_pigments[vals.ingredient_2]/1000)/1000: null;
        $('#price_3').innerHTML=(vals.atm_3)? Math.round (1000*price_pigments[vals.ingredient_3]/1000)/1000: null;
        $('#price_4').innerHTML=(vals.atm_4)? Math.round (1000*price_pigments[vals.ingredient_4]/1000)/1000: null;
        
    });
    make_atm();
    make_total();
    
}
function name_ingredient(ingredient){
    let element;
    for (const key in pigments) {
        if (pigments.hasOwnProperty(key)) {
            if(pigments[key]==ingredient) {
                return key;
            }   
        }
    }
    return '';
}
function make_total(){

    let price_1=($('#price_1').firstChild)?$('#price_1').firstChild.nodeValue: null;
    let price_2=($('#price_2').firstChild)?$('#price_2').firstChild.nodeValue: null;
    let price_3=($('#price_3').firstChild)?$('#price_3').firstChild.nodeValue: null;
    let price_4=($('#price_4').firstChild)?$('#price_4').firstChild.nodeValue: null;
    ///////////////////////////////////////////////////////////
    let atm_1=($('#atm_1').firstChild)? $('#atm_1').firstChild.nodeValue: null;
    let atm_2=($('#atm_2').firstChild)? $('#atm_2').firstChild.nodeValue: null;
    let atm_3=($('#atm_3').firstChild)? $('#atm_3').firstChild.nodeValue: null;
    let atm_4=($('#atm_4').firstChild)? $('#atm_4').firstChild.nodeValue: null;
    //////////////////////////////////////////////////////////
    let total_1=$('#total_1').innerHTML=(price_1)? Math.round(10000*price_1*atm_1)/10000: null;
    let total_2=$('#total_2').innerHTML=(price_2)? Math.round(10000*price_2*atm_2)/10000: null;
    let total_3=$('#total_3').innerHTML=(price_3)? Math.round(10000*price_3*atm_3)/10000: null;
    let total_4=$('#total_4').innerHTML=(price_4)? Math.round(10000*price_4*atm_4)/10000: null;
    $('#amount').innerHTML=Math.round (100*(total_1+total_2+total_3+total_4))/100;

}
    

function make_atm(){
    $('#atm_1').innerHTML=name_col(arr[0]);
    $('#atm_2').innerHTML=name_col(arr[1]);
    $('#atm_3').innerHTML=name_col(arr[2]);
    $('#atm_4').innerHTML=name_col(arr[3]);

    function name_col(atm){
        let val=$('#packing').options[$('#packing').selectedIndex].textContent;
        let number=(atm!=null) ? Math.round(100*(atm.replace(',', '.')* parseInt(val)))/100: null;
        return number;
    }
}












