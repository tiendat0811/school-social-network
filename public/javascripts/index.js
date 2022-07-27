
//upload Image to firebase
var firebaseConfig = {
    apiKey: "AIzaSyDDZttt4vp425JGImaSa_DBGIGM47nKHWo",
    authDomain: "web-final-project-336206.firebaseapp.com",
    projectId: "web-final-project-336206",
    storageBucket: "web-final-project-336206.appspot.com",
    messagingSenderId: "383757308698",
    appId: "1:383757308698:web:70437579d1eaa5969492a3",
    measurementId: "G-KJB14NDSS0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function uploadAvatar() {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#file-input").files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

            $.ajax({
                url: '/student/updateAvatar',
                type: 'post',
                data: {
                    avatar: url
                }
            }).then(data => {
                if (data.success) {
                    alert(data.msg)
                    document.querySelector("#avatar").src = url;
                    document.querySelector(".user-avatar img").src = url
                }
                else {
                    alert(data.msg)
                }
            })
        })
        .catch(console.error);
}

//----------LOGIN
function login() {
    $.ajax({
        url: '/login',
        type: 'post',
        data: {
            username: $('#username').val(),
            password: $('#password').val(),
        }
    }
    ).then(data => {
        setCookie('token', data.token, 1);
        window.location.href = "/"
    }).catch(err => {
        console.log(err)
    })
}

function google() {
    window.setTimeout(function () {
        window.location.href = '/';
    }, 5000);
}

function logout() {
    $.ajax({
        url: '/logout',
        type: 'get',
    }
    ).then(data => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"
    }).catch(err => {
        console.log(err)
    })
}

//Get Set cookies
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//----------LOGIN END


//----------STUDENT

//update thông tin
function updateStudent() {
    $.ajax({
        url: '/student/updateStudent',
        type: 'put',
        data: {
            fullname: $('#fullname').val(),
            class: $('#class').val(),
            falcuty: $('#falcuty').val()
        }
    }).then(data => {
        if (data.success) {
            alert("Cập nhật thông tin thành công")
            window.location.href = "/student"
        } else {
            alert("Cập nhật thông tin thất bại")
        }
    })
}
//----------STUDENT END

//----------INDEX-POST

//add a post
function addPost() {
    const file = document.querySelector("#image").files[0];
    if (file) {
        const ref = firebase.storage().ref();
        const name = +new Date() + "-" + file.name;
        const metadata = {
            contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        var postImg = ''
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                addPostToDB(url)
            })
            .catch(console.error);
    }
    else {
        addPostToDB(null)
    }
}
function addPostToDB(img) {
    var postImg = img
    var caption = $('#caption').val();
    var video = $('#video').val();
    var formData = new FormData();
    formData.append('caption', caption);
    formData.append('video', video);
    if (postImg) {
        formData.append('image', postImg)
    }
    $.ajax({
        url: '/addPost',
        type: 'post',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
    }).then(data => {
        if (data.success) {
            //off preview
            $('#caption').val('')
            $('#video').val('');
            $('#image').val('');
            $('#previewVideo').html('')

            $('#imagePreview').css("display", "none")
            $('#imagePreview').attr("src", "")
            let post = data.postResult
            $.ajax({
                url: '/getUser',
                type: 'post',
                data: {
                    userId: post.user
                },
                success: function (data) {
                    if (data.success) {
                        var html = renderOnePost(post, data.user)
                        var curHtml = $('.timeline').html()
                        $('.timeline').html(html + curHtml)
                    }
                }
            })
        } else {
            alert(data.msg)
        }
    })
}
function previewImage(self) {
    var file = self.files;
    if (file.length > 0) {
        var fileReader = new FileReader();

        fileReader.onload = function (event) {
            $('.previewImage').css("display", "block")
            $('.previewImage img').css("display", "block")
            document.getElementById("imagePreview").setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
    }
}
function previewVideo() {
    let url = document.getElementById("video").value;
    html = checkYoutubeUrl(url)
    document.getElementById('previewVideo').innerHTML = html
}

function checkYoutubeUrl(url) {
    if (url.includes("https://www.youtube.com/embed/")) {
        var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        return html;
    } else {
        if (url.includes("&list=")) {
            var idVideos = url.split("v=");
            var idVideoList = idVideos[idVideos.length - 1];
            idVideos = idVideoList.split("&list=")
            var idVideo = idVideos[0];

            url = "https://www.youtube.com/embed/" + idVideo;
            var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            return html;
        } else {
            if (url.includes("https://www.youtube.com/watch?v=")) {
                var idVideos = url.split("v=");
                var idVideo = idVideos[idVideos.length - 1]

                url = "https://www.youtube.com/embed/" + idVideo;
                var html = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                return html;
            }
            else {
                return '';
            }
        }
    }
}

//add a post end

//edit and delete a post
function unEditPost(id) {
    $(`.caption-left p#id${id}`).css("display", "block")
    $(`.caption-left input#id${id}`).css("display", "none")
    $(`.caption-left button#id${id}`).css("display", "none")
}
function editPost(id) {
    //focus edit
    $(`.caption-left input#id${id}`).val($(`p#id${id}`).html().trim())
    $(`.caption-left p#id${id}`).css("display", "none")
    $(`.caption-left input#id${id}`).css("display", "block")
    $(`.caption-left button#id${id}`).css("display", "block")
    $(`.caption-left input#id${id}`).focus();
    //unfocus

}
function confirmEditPost(id) {
    $.ajax({
        url: '/updateCaption',
        type: 'put',
        data: {
            _id: id,
            caption: $(`input#id${id}`).val()
        }
    }).then(data => {
        if (data.success) {
            $(`p#id${id}`).html($(`input#id${id}`).val())
            $(`p#id${id}`).css("display", "")
            $(`button#id${id}`).css("display", "none")
            $(`input#id${id}.editCaption`).css("display", "none")
        } else {
            alert(data.msg)
        }
    })
}
function deletePost(id) {
    let result = confirm("Bạn chắc chắn muốn xoá bài viết này chứ?");
    if (result === true) {
        $.ajax({
            url: '/deletePost',
            type: 'delete',
            data: {
                _id: id,
            }
        }).then(data => {
            if (data.success) {
                $(`.post#id${id}`).remove();
            } else {
                alert(data.msg)
            }
        })
    }
}

//add a notification
var socket = io();
socket.on('notification', function (notification) {
    var html = `<a href="/notification/${notification.id}"><div class="card">
    <div class="card-header">
        Thông báo
    </div>
    <div class="card-body">
        <blockquote class="blockquote mb-0">
            <p>${notification.category} đã đăng 1 thông báo</p>
            <footer class="blockquote-footer">${notification.title}
            </footer>
        </blockquote>
    </div>
</div>
</a>`
    $('.new-notification-2').css("display", "block")
    $('.new-notification').html(html)
    setTimeout(function () {
        $('.new-notification').html('')
        $('.new-notification-2').css("display", "none")
    }, 5000);
});
function addNotification() {
    var title = $('#notiTitle').val()
    var summary = $('#notiSummary').val()
    var detail = $('#notiDetail').val()
    var permission = $('#permission').val()

    if (permission === '1') {
        alert("Bạn chưa chọn chuyên mục nào")
    } else {
        $.ajax({
            url: '/addNotification',
            type: 'post',
            data: {
                title: title,
                summary: summary,
                detail: detail,
                permission: permission
            }
        }).then(data => {
            if (data.success) {
                //thông báo realtime
                $('#notiTitle').val('')
                $('#notiSummary').val('')
                $('#notiDetail').val('')
                $('#permission option[value="1"]').attr('selected', 'selected');
                socket.emit('notification', {
                    title: data.notiResult.title,
                    category: data.notiResult.category,
                    id: data.notiResult._id
                });
            } else {
                alert(data.msg)
            }
        })
    }
}

//Add new comment
function addComment(id) {
    if ($(`.newComment input#id${id}`).val()) {
        $.ajax({
            url: '/addComment',
            type: 'post',
            data: {
                postId: id,
                comment: $(`.newComment input#id${id}`).val(),
            }
        }).then(data => {
            if (data.success) {
                var commentData = data.newComment
                $.ajax({
                    url: '/getUser',
                    type: 'post',
                    data: {
                        userId: commentData.user
                    },
                    success: function (data) {
                        if (data.success) {
                            $(`.newComment input#id${id}`).val('')

                            var html = renderOneComment(commentData, data.user)
                            var oldHtml = $(`.showComment#id${id}`).html()
                            $(`.showComment#id${id}`).html(html + oldHtml)
                        }
                    }
                })

            } else {
                alert(data.msg)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        alert("Bạn chưa nhập gì")
    }

}

function unEditComment(id) {
    $(`.comment-content p#id${id}`).css("display", "block")
    $(`.comment-content input#id${id}`).css("display", "none")
    $(`.comment-content button#id${id}`).css("display", "none")
}
function editComment(id) {
    $(`.comment-content input#id${id}`).val($(`.comment-content p#id${id}`).html().trim())
    $(`.comment-content p#id${id}`).css("display", "none")
    $(`.comment-content input#id${id}`).css("display", "block")
    $(`.comment-content button#id${id}`).css("display", "block")

    $(`.comment-content input#id${id}`).on('keyup', function (e) {
        if (e.keyCode === 13) {
            confirmEditComment(id)
        }
    });
}
function confirmEditComment(id) {
    $.ajax({
        url: '/updateComment',
        type: 'put',
        data: {
            _id: id,
            comment: $(`.comment-content input#id${id}`).val()
        }
    }).then(data => {
        if (data.success) {
            $(`.comment-content p#id${id}`).html($(`.comment-content input#id${id}`).val())
            $(`.comment-content p#id${id}`).css("display", "")
            $(`.comment-content button#id${id}`).css("display", "none")
            $(`.comment-content input#id${id}`).css("display", "none")
        } else {
            alert(data.msg)
        }
    }).catch(err => {
        console.log(err)
    })
}

//delete comment
function deleteComment(id) {
    let result = confirm("Bạn chắc chắn muốn xoá bình luận này chứ?");
    if (result === true) {
        $.ajax({
            url: '/deleteComment',
            type: 'delete',
            data: {
                _id: id,
            }
        }).then(data => {
            if (data.success) {
                $(`.comment#id${id}`).remove();
            } else {
                alert("Xoá bình luận thất bại")
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
//----------INDEX-POST-END

//----------MANAGER-NOTIFICATION
function changePassword() {
    $.ajax({
        url: '/manager/changePassword',
        type: 'put',
        data: {
            password: $('#password').val(),
        }
    }).then(data => {
        if (data.success) {
            alert("Đổi mật khẩu thành công")
            $('#password').val('')
        } else {
            alert("Đổi mật khẩu thất bại")
        }
    })
}

function showEditNoti(id) {
    $(`.one-notice#id${id} input.title`).val($(`.one-notice#id${id} p.title`).html().trim())
    $(`.one-notice#id${id} input.title`).css("display", "block")
    $(`.one-notice#id${id} p.title`).css("display", "none")

    $(`.one-notice#id${id} input.summary`).val($(`.one-notice#id${id} p.summary`).html().trim())
    $(`.one-notice#id${id} input.summary`).css("display", "block")
    $(`.one-notice#id${id} p.summary`).css("display", "none")

    $(`.one-notice#id${id} textarea.detail`).val($(`.one-notice#id${id} p.detail`).html().trim())
    $(`.one-notice#id${id} textarea.detail`).css("display", "block")
    $(`.one-notice#id${id} p.detail`).css("display", "none")

    $(`.confirm-btn#id${id}`).css("display", "block")
}

function unEditNoti(id, success) {
    if (success) {
        $(`.one-notice#id${id} p.title`).html($(`.one-notice#id${id} input.title`).val())
        $(`.one-notice#id${id} input.title`).css("display", "none")
        $(`.one-notice#id${id} p.title`).css("display", "block")

        $(`.one-notice#id${id} p.summary`).html($(`.one-notice#id${id} input.summary`).val())
        $(`.one-notice#id${id} input.summary`).css("display", "none")
        $(`.one-notice#id${id} p.summary`).css("display", "block")

        $(`.one-notice#id${id} p#detail`).html($(`.one-notice#id${id} textarea.detail`).val())
        $(`.one-notice#id${id} textarea.detail`).css("display", "none")
        $(`.one-notice#id${id} p#.etail`).css("display", "block")

        $(`.confirm-btn#id${id}`).css("display", "none")
    } else {
        $(`.one-notice#id${id} input.title`).css("display", "none")
        $(`.one-notice#id${id} p.title`).css("display", "block")

        $(`.one-notice#id${id} input.summary`).css("display", "none")
        $(`.one-notice#id${id} p.summary`).css("display", "block")

        $(`.one-notice#id${id} textarea.detail`).css("display", "none")
        $(`.one-notice#id${id} p.detail`).css("display", "block")

        $(`.confirm-btn#id${id}`).css("display", "none")
    }
}
function editNotification(id) {
    showEditNoti(id)
}

function confirmEditNoti(id) {
    var title = $(`.one-notice#id${id} input.title`).val()
    var summary = $(`.one-notice#id${id} input.summary`).val()
    var detail = $(`.one-notice#id${id} textarea.detail`).val()

    $.ajax({
        url: '/manager/editNotification',
        type: 'put',
        data: {
            id: id,
            title: title,
            summary: summary,
            detail: detail
        }
    }).then(data => {
        if (data.success) {
            unEditNoti(id, true)
        } else {
            alert(data.msg)
        }
    })
}

function deleteNotification(id) {
    let result = confirm("Bạn chắc chắn muốn xoá thông báo này chứ?");
    if (result === true) {
        $.ajax({
            url: '/manager/deleteNotification',
            type: 'delete',
            data: {
                _id: id,
            }
        }).then(data => {
            if (data.success) {
                $(`.one-notice#id${id}`).remove();
            } else {
                alert(data.msg)
            }
        })
    }
}

