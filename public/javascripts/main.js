//----------LOAD POST

//document ready
$(window).on('scroll', () => {
    const scroll = window.scrollY;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight
    if (scroll >= scrollMax) {
        setTimeout(function () {
            loadMore()
        }, 1000);
    }
})

var postPage = 0
var notificationPage = 0
var categoryCurrent = false
$(function () {
    getPosts(postPage);
    getNotifications(notificationPage)
})

function getNotiByCategory() {
    var category = $('#category').val()
    if (category !== '1') {
        categoryCurrent = category
        notificationPage = 0
        getNotifications(notificationPage, category)
    }
    else {
        getNotifications(notificationPage)
    }
}

function setPageButton() {
    $('.btn-page#id1').html(notificationPage + 1)
    $('.btn-page#id2').html(notificationPage + 2)
    $('.btn-page#id3').html(notificationPage + 3)
    $('.btn-page#id4').html(notificationPage + 4)
}
function backPageCategory() {
    if (categoryCurrent) {
        if (notificationPage > 0) {
            notificationPage = notificationPage - 1
            getNotifications(notificationPage, categoryCurrent)
            setPageButton()
        }
    } else {
        if (notificationPage > 0) {
            notificationPage = notificationPage - 1
            getNotifications(notificationPage)
            setPageButton()
        }
    }
}
function nextPageCategory() {
    if (categoryCurrent) {
        notificationPage = notificationPage + 1
        getNotifications(notificationPage, categoryCurrent)
        console.log(categoryCurrent)
        setPageButton()
    } else {
        notificationPage = notificationPage + 1
        getNotifications(notificationPage)
        setPageButton()
    }
}
function getNotiByPage(self) {
    if (categoryCurrent) {
        if ($('#pageNumber').val()) {
            var page = $('#pageNumber').val()
            notificationPage = page - 1
            getNotifications(notificationPage, categoryCurrent)
            $('#pageNumber').val('')
            setPageButton()
            return
        }
        var page = $(self).html()
        notificationPage = page - 1
        getNotifications(notificationPage, categoryCurrent)
    } else {
        if ($('#pageNumber').val()) {
            var page = $('#pageNumber').val()
            notificationPage = page - 1
            getNotifications(notificationPage, categoryCurrent)
            $('#pageNumber').val('')
            setPageButton()
            return
        }
        var page = $(self).html()
        notificationPage = page - 1
        getNotifications(notificationPage, categoryCurrent)
    }
}
function getNotifications(page, category) {
    if (!category) {
        $.ajax({
            url: '/notifications/' + page,
            type: 'get',
        }).then(data => {
            renderNotifications(data.notifications)
        })
    } else {
        $.ajax({
            url: '/notification/' + category + '/' + page,
            type: 'get',
        }).then(data => {
            renderNotificationsWithCategory(data.notifications)
            setPageButton()
        })
    }

}
function renderNotificationsWithCategory(notifications) {
    if (notifications.length === 0) {
        var html = ''
        $('.notice-box-body').html(html)
    } else {
        $('.notice-box-body').html('')
        $.each(notifications, function (index, notification) {
            var html = renderOneNotification(notification)
            $('.notice-box-body').append(html)
        })
    }
}
function renderNotifications(notifications) {
    $('.notice-box-body').html('')
    $.each(notifications, function (index, notification) {
        var html = renderOneNotification(notification)
        $('.notice-box-body').append(html)
    })
}
function renderOneNotification(notification) {
    var html = `
    <div class="one-notice">
        <div class="notice-date-time">
        [${notification.category}]&nbsp; -${notification.createTime.split(',')[0]}
        </div>
        <div class="notice-title">
            <a href="notification/${notification._id}">${notification.title}</a>
        </div>
        <div class="notice-summary">
        ${notification.summary}
        </div>
    </div>`
    return html
}

//load more post
function loadMore() {
    postPage++
    getPosts(postPage)
}

function getPosts(page) {
    $.ajax({
        url: '/posts/' + page,
        type: 'get',

    }).then(data => {
        renderPosts(data.posts)
        getComments(data.posts)
    })
}

function renderPosts(posts) {
    $.each(posts, function (i, post) {
        $.ajax({
            url: '/getUser',
            type: 'post',
            data: {
                userId: post.user
            },
            success: function (data) {
                if (data.success) {
                    var html = renderOnePost(post, data.user)
                    $('.timeline').append(html)
                }
            }
        })
    })
}
function renderOnePost(post, user) {
    var html1 = `
            <div class="post rounded rounded-3" id="id${post._id}">
                <div class="d-flex postOf">
                    <div class="caption-left d-flex">
                        <div class="user-avatar">
                        <img src="${user.avatar}">
                        </div>         
                        <div class="name-time">
                        <span class="fullname">
                            ${post.fullname}
                        </span><br>
                        <span class="time">
                            ${post.createTime}
                        </span>
                        </div>
                    </div>
                    <div class="caption-right">
                    <div class="my-2 mx-2" role="group"
                    aria-label="Basic mixed styles example">
                        <button type="button" class="btn btn-warning" onclick="editPost('${post._id}')">Sửa</button>
                      <button type="button" class="btn btn-danger" onclick="deletePost('${post._id}')">Xoá</button>
                    </div>
                    </div>
                </div>
                <div class="caption">
                    <div class="caption-left">
                        <p id="id${post._id}" class="caption">
                            ${post.caption}
                        </p>
                        <input type="text" id="id${post._id}">
                        <div class="button-confirm d-flex">
                            <button onclick="unEditPost('${post._id}')"
                                id="id${post._id}"
                                class="m-2 btn-danger">Huỷ</button>
                            <button onclick="confirmEditPost('${post._id}"
                                id="id${post._id}"
                                class="m-2 btn-success">Lưu</button>
                        </div>
                    </div>
                </div>
                <div class="attach">
                    <div class="video">
                    ${post.video}
                    </div>`
    var html2 = ''
    if (post.image) {
        html2 = `<img class="image img-fluid img-thumbnail"
                            src="${post.image}"></img>`
    }
    var html3 = `</div>
                <div class="commentOfPost">
                    <div class="newComment mx-5 d-flex">
                        <input class="form-control" type="text" id="id${post._id}"
                            placeholder="Viết bình luận...">
                        <button class="btn btn-primary mx-2 "
                            onclick="addComment('${post._id}')">Gửi</button>
                    </div>
                    <div class="showComment py-2" id="id${post._id}">
                    </div>
                </div>
            </div>`
    var html = html1 + html2 + html3
    return html;
}

function renderOneComment(comment, user) {
    var html = `<div class="comment p-1" id="id${comment._id}">
        <div class="comment-content rounded rounded-3 mt-2 mx-2 p-2 bg-light ">
          <div class="comment-content-header d-flex">
          <div class="user-avatar">
                    <img src="${user.avatar}">
                    </div>
                    <div class="name-time">
                    <span class="fullname">
                        ${comment.fullname}
                    </span><br>
                    <span class="time">
                        ${comment.createTime}
                    </span>
                    </div>
            <div class="d-flex tool-comment">
              <button class="btn link-info bg-white px-2 py-0 border border-2 rounded-3 mx-2"
                onclick="editComment('${comment._id}')">
                Sửa
              </button>
              <button class="btn link-danger bg-white px-2 py-0 border border-2 rounded-3"
                onclick="deleteComment('${comment._id}')">
                Xoá
              </button>
            </div>
          </div>
          <p class="comment-detail fs-6 my-0" id="id${comment._id}">
          ${comment.comment}
          </p>
          <input type="text" id="id${comment._id}">
          <div class="button-confirm d-flex">
            <button onclick="unEditComment('${comment._id}')"
              id="id${comment._id}" class="m-2 btn-danger">Huỷ</button>
            <button onclick="confirmEditComment('${comment._id}')"
              id="id${comment._id}" class="m-2 btn-success">Lưu</button>
          </div>
        </div>
      </div>`
    return html
}
function getComments(posts) {
    $.each(posts, function (i, post) {
        $.ajax({
            url: '/comments',
            type: 'post',
            data: {
                postId: post._id
            },
            success: function (data) {
                renderComments(data.comments)
            }
        })
    })
}

function renderComments(comments) {
    $.each(comments, function (i, comment) {
        $.ajax({
            url: '/getUser',
            type: 'post',
            data: {
                userId: comment.user
            },
            success: function (data) {
                var html = renderOneComment(comment, data.user)
                $(`.showComment#id${comment.postId}`).append(html)
            }
        })
    })
}

//----------END LOAD POST


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

//----------ADMIN

function createAccount() {
    var checkedValue = document.getElementsByName('permission');
    var permission = []
    for (var i = 0; i < checkedValue.length; i++) {
        if (checkedValue[i].checked) {
            permission.push(checkedValue[i].value)
        }
    }

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
            alert("Tạo tài khoản thành công")
            window.location.href = "/admin"
        } else {
            alert("Tạo tài khoản thất bại")
        }
    }).catch(err => {

        console.log(err)
    })
}

//----------ADMIN END

//----------Manager
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
            window.location.href = "/manager"
        } else {
            alert("Đổi mật khẩu thất bại")
        }
    }).catch(err => {
        console.log(err)
    })
}
//----------Manager END

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
    }).catch(err => {
        console.log(err)
    })
}
//----------STUDENT END

//----------INDEX-POST

//add a post
function addPost() {
    var caption = $('#caption').val();
    var video = $('#video').val();
    var image = document.getElementById("image").files;

    var formData = new FormData();
    formData.append('caption', caption);
    formData.append('video', video);
    formData.append('image', image[0])
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
    }).catch(err => {
        console.log(err)
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

    //Enter sau khi edit
    $(`.caption-left input#id${id}`).on('keyup', function (e) {
        if (e.keyCode === 13) {
            confirmEditPost(id)
        }
    });
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
            $(`input#id${id}`).css("display", "none")
        } else {
            alert(data.msg)
        }
    }).catch(err => {
        console.log(err)
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
        }).catch(err => {
            console.log(err)
        })
    }
}

//add a notification
var socket = io();
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
                    category: data.notiResult.category
                });
                socket.on('notification', function (notification) {
                    var html = `<a href="/notification/${data.notiResult._id}"><div class="card">
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
            } else {
                alert(data.msg)
            }
        }).catch(err => {
            console.log(err)
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