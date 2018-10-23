
let dom_elements={
    main_block:document.getElementById('main_block'),
    form_msn:document.getElementById('form_msn'),
    text_msn:document.getElementById('text_msn'),
    left_block:document.getElementById('left_block'),
    right_block:document.getElementById('right_block'),
    form_msn:document.getElementById('form_msn'),
    window: document.getElementById('window'),
    text_window: document.getElementById('text_window'),
    footer: document.getElementById('footer'),
    message: document.getElementById('message'),
    send_msn:document.getElementById('send_msn')

};
let my_id;
let name;
let socket=io({
    autoConnect:false
});
let users={};
let event=new Event('click');
//функция проверки ввода и длинны имени 
function func_name(){
    let temp=dom_elements.text_window.value;
    if(!temp||temp.length>20){
        alert('You have not entered your name. Please do it again.' );
        temp=func_name();
    }
    socket.open();
    return temp;
}
//загрузка страницы
onload=()=>{
    dom_elements.text_window.focus();

}

socket.on('connect', () => {
    my_id='U'+((socket.id).substr(0,4)).toString();
 });
 socket.on('add users',(data)=>{
    to_left_block(data);

});
socket.on('disconnect',(reason)=>{
//    console.log('disconnect');
    if(reason==='io server disconnect'){
        socket.connect();
    }
});
socket.on('message',(data)=>{
//    console.log(data);
    show_message(data, 'them');
});
dom_elements.window.onsubmit=(e)=>{
    e.preventDefault();
    name=func_name();
    dom_elements.main_block.innerHTML+=`Hello ${name}`;
    dom_elements.text_msn.focus();
    socket.emit('add users', name);
    dom_elements.footer.style.display='block';
    dom_elements.window.style.display='none';
    delete(dom_elements.window);
    delete(dom_elements.text_window);
    dom_elements.text_msn.focus();

}
dom_elements.send_msn.onclick=(e)=>{
//    console.log(e);
    e.preventDefault();
    let data={
        'name': [name],
        'message':dom_elements.text_msn.value,
        'date':new Date().toLocaleTimeString()
    };
    dom_elements.text_msn.value='';
//    console.log(data);
    socket.send(data);
    show_message(data, 'me');
    dom_elements.text_msn.focus();
}
dom_elements.form_msn.addEventListener('keypress',(e)=>{
    if(e.keyCode===13){
//        console.log('jr');
        e.preventDefault();
        dom_elements.send_msn.dispatchEvent(event);
    }
});
   
    
function to_left_block(data){
    if (data.hasOwnProperty('delate')){
//            console.log('Пользователь disconnected id='+data['delate'] );
            let elem=document.querySelector(`.${data['delate']}`);
            if(!elem)return;
            elem.remove();
        }else{
        for(let key in data){
            let new_div=document.createElement('div');
            new_div.className=key;
//            console.log(new_div);
            new_div.innerHTML=`<p>${data[key]} connected</p>`;
            dom_elements.left_block.insertBefore(new_div,dom_elements.left_block.firstChild);
            }
        }
}
function show_message (data, who){
    let new_div=document.createElement('div');
    dom_elements.message.style.backgroundColor='#000000';
    new_div.innerHTML=`${data.name}: ${data.message} (${data.date})`;
    new_div.className=((who==='me')? 'animate':'animate other');
    dom_elements.message.insertBefore(new_div, dom_elements.message.firstChild);
    setTimeout(()=>{ new_div.style.color='#ffffff';},100);
    if(dom_elements.message.childElementCount>50){
        (dom_elements.message.children[50]).remove();
    }
    
}
