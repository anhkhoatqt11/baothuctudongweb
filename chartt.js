var today = new Date();
th = today.getMonth()+1;
ng = today.getDay();
ngay = today.getDate()*1000000;
thang = (today.getMonth()+1)*10000;
nam = today.getFullYear();
date = ngay+thang+nam;
function time()
{
  if (ng < 1)
  {
    th = th - 1;
    if (nam % 4 == 0){
      if (th == 1 || th == 3 || th == 5 || th == 7 || th == 8 || th == 10 || th == 12)
        thangT = 31;
      else if (th == 2)
        thangT = 29;
      else thangT = 30;
    } 
    else {
      if (th == 1 || th == 3 || th == 5 || th == 7 || th == 8 || th == 10 || th == 12)
        thangT = 31;
      else if (th == 2)
        thangT = 28;
      else thangT = 30;
    }
    ng = thangT;
  }
  else if (ng > 1) {
    ng = today.getDate();
  }
}
function previousdate()
{
  ng = ng - 1;
  time();
  console.log(ng);
  console.log(th);
}
function gopbien()
{
  date = ng*1000000+th*10000+nam;
  console.log(date);
}
if (today.getDate()<10)
{
  url = "thiet-bi-ho-tro-giac-ngu.firebaseio.com/" + auth.currentUser.uid + 0 + date;
}else{
  url = "thiet-bi-ho-tro-giac-ngu.firebaseio.com/" + auth.currentUser.uid + date;
}
function refresh()
{
  if (today.getDate()<10)
  {
    url = "thiet-bi-ho-tro-giac-ngu.firebaseio.com/" + auth.currentUser.uid + 0 + date;
  }else{
    url = "thiet-bi-ho-tro-giac-ngu.firebaseio.com/" + auth.currentUser.uid + date;
  }
}
var HeartRate = [], Ax = [], light = [], motion = [];
var firebase = new Firebase(url);
firebase.on('value', function(snapshot) {
 for(let i in snapshot.val().HeartRate){
   HeartRate.push(snapshot.val().HeartRate[i]);
 }
 for(let i in snapshot.val().Ax){
   Ax.push(snapshot.val().Ax[i]);
 }
 for(let i in snapshot.val().light){
   light.push(snapshot.val().light[i]);
 }
 for(let i in snapshot.val().motion){
   motion.push(snapshot.val().motion[i]);
 }
 HeartRate = HeartRate.slice(HeartRate.length- 500, HeartRate.length);
 Ax = Ax.slice(Ax.length- 500, Ax.length);
 light = light.slice(light.length- 20, light.length);
 light.forEach((o, i, a) => a[i] = o*100/1024);
 motion = motion.slice(motion.length- 20, motion.length);
 drawGraph(HeartRate, Ax, light, motion);
});
function drawGraph(HeartRate){
     var labels = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
   var ctx = document.getElementById("myChartax").getContext('2d'); 
  var barChartData ={
      labels: labels,
      datasets: [{    
      label: 'Nhịp tim',
        backgroundColor: 'rgb(258, 0, 0)',
        data: HeartRate,
        yAxisID: "y-axis-temp",
      }, {
        label: 'Ax',
        backgroundColor: 'rgb(0, 0, 258)',
              borderColor: 'rgb(0, 0, 258)',
        data: Ax,
      },]

    };
  var myChartax = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
  //ngang đây k sửa
  options: {
    responsive: true,
    maintainAspectRatio: true,
    hoverMode: 'index',
    stacked: false,
    title:{
      display: true,
      text:'Biểu đồ nhịp tim',  
    },

    scales: {
      yAxes: [{
        type: "linear", 
        display: true,
        position: "left",
        id: "y-axis-temp",
        ticks: {
          beginAtZero:true,
          suggestedMax: 50
        }

      }],
      xAxes: [{
      }],
    }
  }
});
}