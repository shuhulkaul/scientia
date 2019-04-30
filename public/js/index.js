

   function preventBack(){window.history.forward();}
    setTimeout("preventBack()", 0);
    window.onunload=function(){null};

    function showDiv(element)
{
      
      document.getElementById("hidden_div1").style.display = element.value == "branch" ? 'block' : 'none';
      document.getElementById("hidden_div0").style.display = element.value == "course" ? 'block' : 'none';
      document.getElementById("hidden_div2").style.display = element.value == "hostel" ? 'block' : 'none';
    
}