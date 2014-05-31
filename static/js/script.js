var ping = function() {
  jQuery.ajax({url:'/online/?check=ajax'}).done(function(data) {
    if(data.reload) {
      window.location.reload();
    } else if (data.msg) {
      document.getElementById('msg').innerHTML = data.msg;
      document.getElementById('msg').style.display = 'block';
    } else {
      document.getElementById('msg').style.display = 'none';
    }
  });
};

setInterval(ping, 10000);