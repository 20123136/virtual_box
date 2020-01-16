    $(document).ready(function(){
    function init() {
        get_preassignment()
        $('#hanxin_ip').val(localStorage.getItem('hanxin_ip'))
        $('#hanxin_port').val(localStorage.getItem('hanxin_port'))
        let task_info = JSON.parse(localStorage.getItem('task_info') || '{}')
        $('#start').val(task_info.start)
        $('#start-action').val(task_info.start_action)
        $('#goal').val(task_info.goal)
        $('#goal-action').val(task_info.goal_action)
        $('#preassignment').val(task_info.preassignment)
        realtimeRefresh()
    }
    init()

    function realtimeRefresh() {
        let hanxin_ip = localStorage.getItem('hanxin_ip') // 韩信IP
        let hanxin_port = localStorage.getItem('hanxin_port')   // 韩信接口服务端口号
        if (!(hanxin_ip && hanxin_port)) {
            return
        }
        let status = -1
        if (localStorage.getItem('task_id')) {
            status = task_status()
        }
        get_preassignment()

        if (status == 0 || status == 6) {
            $(".btn_green").css("display", "block")
            $(".btn_red").css("display", "none")
        }
        else {
            $(".btn_red").css("display", "block")
            $(".btn_green").css("display", "none")
            if (status == 3 || status == 4 || status == 5) {
                localStorage.removeItem('task_id')
            }
        }
    }


    // 定时查询当前任务状态
    setInterval(() => {
        realtimeRefresh()
    }, 1000)

    // 查询任务状态函数
    function task_status() {
        let hanxin_ip = localStorage.getItem('hanxin_ip') // 韩信IP
        let hanxin_port = localStorage.getItem('hanxin_port')   // 韩信接口服务端口号
        if (!(hanxin_ip && hanxin_port)) {
            return
        }
        let result = null
        let task_id = localStorage.getItem('task_id')
        $.ajax({
            url: `http://${hanxin_ip}:${hanxin_port}/api/v1/task/get_task_status/${task_id}`,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (res) {
                console.log(res)
                if (res.errno == '0') {
                    result = res.data.status
                }
                else {
                    alert(res.errmsg)
                }
            },
            error: function (e) {
                console.log(e)
            }
        })
        return result
    }

    // 查询所有已注册机器人显示在预分配机器人列表
    function get_preassignment() {
        let hanxin_ip = localStorage.getItem('hanxin_ip') // 韩信IP
        let hanxin_port = localStorage.getItem('hanxin_port')   // 韩信接口服务端口号
        if (!(hanxin_ip && hanxin_port)) {
            return
        }
        $.ajax({
            url: `http://${hanxin_ip}:${hanxin_port}/api/v1/robot/get_robots_by_status/2`,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (res) {
                if (res.errno == '0') {
                    let result = res.data.agents
                    $("#preassignment").empty()
                    for (let i = 0; i < result.length; i++) {
                        $("#preassignment").append(`<option value='${result[i].serial}'>${result[i].nickname}</option>`)
                    }
                }
                else {
                    alert(res.errmsg)
                }
            },
            error: function (e) {
                console.log(e)
            }
        })
    }


    // 点击红色按钮事件
    document.querySelector(".btn_red").onclick = function () {
        let task_info = localStorage.getItem('task_info')
        console.log(task_info)
        let hanxin_ip = localStorage.getItem('hanxin_ip') // 韩信IP
        let hanxin_port = localStorage.getItem('hanxin_port')   // 韩信接口服务端口号
        if (!(hanxin_ip && hanxin_port)) {
            alert("请先添加韩信ip信息")
            return
        }
        if (!task_info) {
            alert("请先添加任务信息")
            return
        }
        if (!localStorage.getItem('task_id')) {
            console.log('添加任务')
            $.ajax({
                url: `http://${hanxin_ip}:${hanxin_port}/api/v1/task/add_task`,
                type: "POST",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: task_info,
                success: function (res) {
                    console.log(res)
                    if (res.errno == '0') {
                        localStorage.setItem('task_id', res.id[0])
                        alert("添加任务成功")
                    }
                    else {
                        alert(res.errmsg)
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
        else {
            alert("任务正在执行中，请稍后添加")
        }

    }

    // 双击绿色按钮事件
    $(".btn_green").on("dblclick", function () {
        let task_id = localStorage.getItem('task_id')
        let hanxin_ip = localStorage.getItem('hanxin_ip') // 韩信IP
        let hanxin_port = localStorage.getItem('hanxin_port')   // 韩信接口服务端口号
        $.ajax({
            url: `http://${hanxin_ip}:${hanxin_port}/api/v1/task/cancel_tasks`,
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id_lst": [parseInt(task_id)]
            }),
            success: function (res) {
                console.log(res)
                if (res.errno == '0') {
                    localStorage.removeItem('task_id')
                    alert("取消任务成功")
                }
                else {
                    alert(res.errmsg)
                }
            },
            error: function (e) {
                console.log(e)
            }
        })
    })
    $('#hanxin')
        .bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                hanxin_ip: {
                    validators: {
                        notEmpty: {
                            message: 'IP不能为空'
                        },
                        ip: {
                            ipv4: true,
                            message: '请输入合法ip'
                        }
                    }
                },
                hanxin_port: {
                    validators: {
                        notEmpty: {
                            message: '端口不能为空'
                        },
                        between: {
                            min: 1,
                            max: 65535,
                            message: '端口范围：1~65535'
                        },
                        digits: {
                            message: '只能输入数字'
                        }
                    }
                }
            }
        })
        .on('success.field.bv', function (e, data) {
            console.log('222222')
            e.preventDefault()
            // $(e.target)  --> The field element
            // data.bv      --> The BootstrapValidator instance
            // data.field   --> The field name
            // data.element --> The field element
            console.log('添加韩信信息到本地')
            localStorage.setItem('hanxin_ip', $('#hanxin_ip').val())
            localStorage.setItem('hanxin_port', $('#hanxin_port').val())
            alert("添加成功")

        });


    $('#task')
        .bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                start: {
                    validators: {
                        notEmpty: {
                            message: '不能为空'
                        },
                        stringLength: {
                            min: 1,
                            max: 22,
                            message: '长度范围：1~22位字符'
                        }
                    }
                },
                goal: {
                    validators: {
                        notEmpty: {
                            message: '不能为空'
                        },
                        stringLength: {
                            min: 1,
                            max: 22,
                            message: '长度范围：1~22位字符'
                        }
                    }
                },
                preassignment: {
                    validators: {
                        notEmpty: {
                            message: '不能为空'
                        }
                    }
                }
            }
        })
        .on('success.field.bv', function (e, data) {
            console.log('222222')
            e.preventDefault()
            // $(e.target)  --> The field element
            // data.bv      --> The BootstrapValidator instance
            // data.field   --> The field name
            // data.element --> The field element
            console.log('添加任务信息到本地')
            localStorage.setItem('task_info', JSON.stringify(
                {
                    start: $('#start').val(),
                    goal: $('#goal').val(),
                    start_action: $('#start-action').val(),
                    goal_action: $('#goal-action').val(),
                    preassignment: $('#preassignment').val(),
                }
            ))
            alert("添加成功")

        });
    })
