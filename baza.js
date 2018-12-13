class Baza{
    constructor(){
        this.sql=require('sqlite3').verbose();
    };
     getPrice (id, callback){
        let err, data;
        let db=new this.sql.Database('public/sql/mybase.db');
    
        if(typeof id!='number') {
            err='error now';
        
            data=NaN;
            callback(err,data);          
        }else{
            data=basa(`SELECT * FROM prices as p WHERE p.product_id=${id}`, db, (err,data)=>{
                callback(err,data);
            });
        }
    
        
        
    }
    getCollection(id, callback){
        let err, data;
        let db=new this.sql.Database('public/sql/mybase.db');
        if(typeof id!='number') {
            err='error now';
        
            data=NaN;
            callback(err,data);          
        }else{
            data=basa(`SELECT ct.collection_name, c.color_number from recipes as r 
            join collections as ct join colors  as c 
            where r.product_id=${id} and r.color_id=c.color_id and ct.collection_id=c.collection_id`, db, (err,data)=>{
                callback(err,data);
            });
        }
    }
    
    getRecipes(product_id, color_number, callback){
        //console.log('product='+product_id+' color='+color_number)
        let err, data;
        let db=new this.sql.Database('public/sql/mybase.db');
        if(typeof product_id!='number') {
            err='error now';
        
            data=NaN;
            callback(err,data);          
        }else{
            basa(`SELECT 
                        r.ingredient_1, r.atm_1,
                        r.ingredient_2, r.atm_2,
                        r.ingredient_3, r.atm_3,
                        r.ingredient_4, r.atm_4 
                    FROM recipes as r, colors as c
                    WHERE c.color_id=r.color_id AND 
                        c.color_number="${color_number}" AND
                        r.product_id=${product_id}`, db, (err,data)=>{
                callback(err,data);
            });
        }
        
    }
    get_price_pigments(callback){
        let db=new this.sql.Database('public/sql/mybase.db');
        basa('SELECT p.product_id, p.price FROM prices as p WHERE p.packing=1', db, (err,data)=>{
            callback(data);
        } );

    }

}
module.exports = new Baza();
function basa(query, db, callback){
        db.serialize(function() {
        //********************************************************************************************************
        //                       Готовое решение для получение рецепта по product_id and color_number
        db.all(query,(err=false,row)=>{
            if(err)row=0; 
            callback(err,row);
            db.close((err)=>{
                if(err) Console.error(err.message);
                //console.log("The connection of database is closed");
            });   
         });
});
}