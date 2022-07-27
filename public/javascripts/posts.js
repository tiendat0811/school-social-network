
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

$(function () {
    getPosts(postPage);
})


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
                        <a href="/student/${post.user}">
                        <img src="${post.avatar}">
                        </a>
                        </div>         
                        <div class="name-time">
                        <span class="fullname">
                        <a href="/student/${post.user}">
                        ${post.fullname}
                        </a>
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
                        <input type="text" id="id${post._id}" class="editCaption">
                        <div class="button-confirm d-flex">
                            <button onclick="unEditPost('${post._id}')"
                                id="id${post._id}"
                                class="m-2 btn-danger">Huỷ</button>
                            <button onclick="confirmEditPost('${post._id}')"
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
                    <a href="/student/${comment.user}">
                    <img src="${user.avatar}">
                    </a>
                    </div>
                    <div class="name-time">
                    <span class="fullname">
                        <a href="/student/${comment.user}">
                        ${comment.fullname}
                        </a>
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