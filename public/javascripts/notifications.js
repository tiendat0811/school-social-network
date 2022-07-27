var notificationPage = 0
var categoryCurrent = false
$(function () {
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
        notificationPage = 0
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
            if (page === 0) {
                $('.float-notice-box-body').html('')
                $.each(data.notifications, function (index, notification) {
                    var html = renderOneNotification(notification)
                    $('.float-notice-box-body').append(html)
                })
                renderNotifications(data.notifications)
            } else {
                renderNotifications(data.notifications)
            }

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
    <div class="one-notice border-secondary border-3 border-bottom m-2">
    <a href="/notification/${notification._id}">
        <div class="notice-date-time fs-7 fw-light fst-italic">
        [${notification.category}]&nbsp; -${notification.createTime.split(',')[0]}
        </div>
        <div class="notice-title fs-5 fw-bold">
            ${notification.title}
        </div>
        <div class="notice-summary fw-lighter">
        ${notification.summary}
        </div>
        </div>
    </div>`
    return html
}