function deleteAccount(id) {
    var r = confirm(`Bạn chắc muốn xoá tài khoản này chứ?`);
    if (r == true) {
        $.ajax({
            url: '/admin/delete-account',
            type: 'delete',
            data: {
                _id: id,
            }
        }).then(data => {
            if (data.success) {
                $(`#${id}`).remove();
                alert(data.msg)
            } else {
                alert(data.msg)
            }
        })
    }
}


function createAccount() {
    var checkedValue = document.getElementsByName('permission');
    var permission = []
    for (var i = 0; i < checkedValue.length; i++) {
        if (checkedValue[i].checked) {
            permission.push(checkedValue[i].value)
        }
    }
    if (permission.length == 0 || $('#fullname').val() == "" || $('#username').val() == "" || $('#password').val() == "") {
        alert('Vui lòng nhập đầy đủ thông tin')
    } else {
        $.ajax({
            url: '/admin/register',
            type: 'post',
            data: {
                fullname: $('#fullname').val(),
                username: $('#username').val(),
                password: $('#password').val(),
                permission: JSON.stringify(permission)
            }
        }).then(data => {
            if (data.success) {
                alert(data.msg)
                $('#fullname').val('')
                $('#username').val('')
                $('#password').val('')
                for (var i = 0; i < checkedValue.length; i++) {
                    if (checkedValue[i].checked) {
                        console.log(checkedValue[i].value)
                        checkedValue[i].checked = false
                    }
                }
                window.location.reload()
            } else {
                alert(data.msg)
            }
        })
    }
}

function createAccount() {
    var checkedValue = document.getElementsByName('permission');
    var permission = [];
    var fullname = $('.mainForm#fullname').val();
    var username = $('.mainForm#username').val();
    var password = $('.mainForm#password').val();
    for (var i = 0; i < checkedValue.length; i++) {
        if (checkedValue[i].checked) {
            permission.push(checkedValue[i].value)
        }
    }
    if (permission.length == 0 || fullname == "" || username == "" || password == "") {
        alert('Vui lòng nhập đầy đủ thông tin')
    } else {
        $.ajax({
            url: '/admin/register',
            type: 'post',
            data: {
                fullname: fullname,
                username: username,
                password: password,
                permission: JSON.stringify(permission)
            }
        }).then(data => {
            if (data.success) {
                alert(data.msg)
                $('#fullname').val('')
                $('#username').val('')
                $('#password').val('')
                for (var i = 0; i < checkedValue.length; i++) {
                    if (checkedValue[i].checked) {
                        console.log(checkedValue[i].value)
                        checkedValue[i].checked = false
                    }
                }
                window.location.reload()
            } else {
                alert(data.msg)
            }
        })
    }
}

function updateAccount(id) {
    var checkedValue = document.getElementsByName(`permission${id}`);
    var permission = [];
    var fullname = $(`#fullname${id}`).val();
    var username = $(`#username${id}`).val();
    var password = $(`#password${id}`).val();
    for (var i = 0; i < checkedValue.length; i++) {
        if (checkedValue[i].checked) {
            permission.push(checkedValue[i].value)
        }
    }
    var user = { _id: id };
    if (permission.length != 0) {
        user.permission = JSON.stringify(permission)
    }
    if (fullname != "") {
        user.fullname = fullname
    }
    if (username != "") {
        user.username = username
    }
    if (password != "") {
        user.password = password
    }
    $.ajax({
        url: '/admin/updateAccount',
        type: 'put',
        data: {
            user: user
        }
    }).then(data => {
        if (data.success) {
            alert(data.msg)
            window.location.reload()
        } else {
            alert(data.msg)
        }
    })
}