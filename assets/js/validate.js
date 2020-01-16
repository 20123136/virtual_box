$(document).ready(function() {
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
                            max:65535,
                            message: '端口范围：1~65535'
                        },
                        digits: {
                            message: '只能输入数字'
                        }
                    }
                }
            }
        })
        .on('success.field.bv', function(e, data) {
            console.log('222222')
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
                            max:22,
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
                            max:22,
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
        .on('success.field.bv', function(e, data) {
            console.log('222222')
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