const activatedInLinks = document.querySelectorAll('.activated');
// listen for auth status changes
// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("usermail").innerHTML=user.email;
    document.getElementById("username-info").innerHTML=auth.currentUser.displayName;
    document.getElementById("login-warning").innerHTML= "<p class='blue-text'>Đăng nhập thành công</p>";
    localStorage.setItem("iduser", auth.currentUser.uid);
    if (user.emailVerified == true)
    {
    document.getElementById("verified").innerHTML= "Đã kích hoạt <i class='material-icons' style='color:purple'>verified</i>"
    activatedInLinks.forEach(item => item.style.display = 'none');
    document.getElementById("useruid").innerHTML=user.uid;
    var iduser = auth.currentUser.uid;
    }else{
      document.getElementById("verified").innerHTML= "Chưa kích hoạt";
      activatedInLinks.forEach(item => item.style.display = 'block');
      document.getElementById("useruid").innerHTML="Hãy kích hoạt tài khoản!";
    }
    setupUI(user);
  } else {
   setupUI();
  }
})

//create form
const taoform = document.querySelector('#tao-form');
taoform.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('dulieu').add({
    name: auth.currentUser.displayName,
    job: taoform.job.value,
    age: taoform.age.value,
    tall: taoform.tall.value,
    weight: taoform.weight.value,
    timetosleep: taoform.timetosleep.value,
    heartillness: taoform.heartillness.value,
    chatkichthich: taoform.chatkichthich.value
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    taoform.reset();
    document.getElementById("sentdata-warning").innerHTML= "Đã gửi dữ liệu thành công!";
  }).catch(err => {
    console.log(err.message);
    document.getElementById("sentdata-warning").innerHTML= "Đã gửi dữ liệu thành công!";
  });
});
  
  // signup
  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['name'].value;
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      const modal = document.querySelector('#modal-signup');
      document.getElementById("signup-warning").innerHTML= "<p class='blue-text'>Đăng ký tài khoản thành công, kiểm tra Email để tiến hành kích hoạt tài khoản!</p>";
      auth.currentUser.updateProfile({
      displayName: name
      });
      auth.currentUser.sendEmailVerification().then(function(){
      }).catch(function(error){
      });
      setTimeout(()=>[M.Modal.getInstance(modal).close()],3000)
      signupForm.reset();
      setTimeout(()=>{window.location.reload()},2000)
    });
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      //kiểm tra lỗi
      var errorCode = error.code;
      if (error.code == "auth/email-already-in-use")
      {
        error.message = "<p class='red-text'>Email đã được sử dụng bởi một người khác. Vui lòng đăng ký bằng địa chỉ Email khác!</p>";
      }
      if (error.code == "auth/user-not-found")
      {
        error.message = "<p class='red-text'>Người dùng không tồn tại, vui lòng đăng ký tài khoản hoặc thử lại!</p>";
      }
      if (error.code == "auth/weak-password")
      {
        error.message = "<p class='red-text'>Mật khẩu phải chứa ít nhất 6 kí tự!</p>"
      }
      if (error.code == "auth/network-request-failed")
      {
        error.message = "<p class='red-text'>Mất kết nối đến Internet! Vui lòng kiểm tra kết nối!</p>"
      }
      document.getElementById("signup-warning").innerHTML= error.message;
    });
  });
  
  // đăng xuất
  const logout = document.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    localStorage.removeItem("iduser");
    setTimeout(()=>{window.location.reload()},200);
  });   
  
  //đăng nhập
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //lấy email và password
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
  
    //đăng nhập
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
      // đóng và reset form
      const modal = document.querySelector('#modal-login');
      setTimeout(()=>[M.Modal.getInstance(modal).close()],1000)
      loginForm.reset();
      setTimeout(()=>{window.location.reload()},2000)
    });
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      //kiểm tra lỗi
      var errorCode = error.code;
      if (error.code == "auth/wrong-password")
      {
        error.message = "<p class='red-text'>Bạn đã nhập sai mật khẩu, vui lòng thử lại!</p>";
      }
      if (error.code == "auth/user-not-found")
      {
        error.message = "<p class='red-text'>Người dùng không tồn tại, vui lòng đăng ký tài khoản hoặc thử lại!<p>";
      }
      if (error.code == "auth/user-disabled")
      {
        error.message = "<p class='red-text'>Bạn đã bị chặn bởi quản trị viên! Vui lòng liên hệ qua Fanpage để được mở khoá</p>";
      }
      if (error.code == "auth/too-many-requests")
      {
          error.message = "<p class='red-text'>Quá nhiều lượt đăng nhập, vui lòng thử lại sau!</p>"
      }
      if (error.code == "auth/network-request-failed")
      {
        error.message = "<p class='red-text'>Mất kết nối đến Internet! Vui lòng kiểm tra kết nối!</p>"
      }
      document.getElementById("login-warning").innerHTML= error.message;
    });
  });
  
  function active() {
    auth.currentUser.sendEmailVerification().then(function(){
      document.getElementById("email-request").innerHTML= "Đã gửi mail xác nhận thành công";
    }).catch(function(error){
      if (error.code == "auth/too-many-requests")
      {
        document.getElementById("email-request").innerHTML= "Bấm từ từ bạn ei!";
      }
    });
  };

  const recoveryForm = document.querySelector('#recovery-form');
  recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const emailAddress = recoveryForm['recovery-email'].value;
  
    // sign up the user
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      const modal = document.querySelector('#modal-login');
      setTimeout(()=>[M.Modal.getInstance(modal).close()],3000)
      recoveryForm.reset();
      document.getElementById("recovery-warning").innerHTML= "<p class='blue-text'>Đã gửi mail khôi phục tài khoản thành công</p>";
    }).catch(function(error) {
if (error.code == "auth/user-not-found")
{
  document.getElementById("recovery-warning").innerHTML= "<p class='red-text'>Tài khoản không tồn tại!</p>"
}
if (error.code == "auth/network-request-failed")
{
  document.getElementById("recovery-warning").innerHTML= "<p class='red-text'>Mất kết nối đến Internet! Vui lòng kiểm tra kết nối!</p>"
}
console.log(error.code);
    });
  });