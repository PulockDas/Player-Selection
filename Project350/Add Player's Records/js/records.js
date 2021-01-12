//location.reload();
document.getElementById("if_batsman").onclick=function(){
    confirm("are you sure?");
        console.log("bal");
    
        let inputs = document.getElementsByClassName("batsmanInfo");
    
        // location.reload();
    
        for (let index = 0; index < inputs.length; index++) {
            inputs[index].disabled = false;
    
            console.log(inputs[index]);
        }
}

document.getElementById("if_not_batsman").onclick=function(){
    confirm("are you sure?");
        console.log("bal");
    
        let inputs = document.getElementsByClassName("batsmanInfo");
    
        // location.reload();
    
        for (let index = 0; index < inputs.length; index++) {
            inputs[index].disabled = true;
    
            console.log(inputs[index]);
        }
}
