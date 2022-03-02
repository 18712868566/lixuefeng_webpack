var Projet_Global_Parameter = {
    // 重复点击开关
    bOff: true, // 自定义开关 布尔值
    bEmail: null, // 是否是一个邮箱 布尔值
    upData: null, // url中返回的携带的参数
    aUrlData: [], // 存储url中返回的参数数组
    user_from_uid: '', // 分享参数
    // 补0操作 如果数字为3，则输出0003，不够位数就在之前补足0，
    PrefixInteger: function(num, length) {
        return ("0000000000000000" + num).substr(-length);
    },
    // 获取返回链接的参数对象
    getUrlData: function() {
        url = window.location.href; //获取当前页面的url
        // console.log(url)
        if (url.indexOf('?role_id') == -1) {
            arr = url;
            // console.log('没找到');
        } else {
            arr = url.split("?")[1].split("&");
            // console.log('找到了');
            var enUrl = decodeURI(url); //解码
            var len = enUrl.length; //获取url的长度值
            var a = enUrl.indexOf("?"); //获取第一次出现？的位置下标
            var b = enUrl.substr(a + 1, len); //截取问号之后的内容
            var c = b.split("&"); //从指定的地方将字符串分割成字符串数组
            var arr = new Array(); //新建一个数组
            for (var i = 0; i < c.length; i++) {
                var d = c[i].split("=")[1]; //从=处将字符串分割成字符串数组,并选择第2个元素
                arr.push(d); //将获取的元素存入到数组中
            }

            return arr;
        }
    },
    resGetUrlData: function() {
        // 浏览器参数,返回数组
        Projet_Global_Parameter.aUrlData = Projet_Global_Parameter.getUrlData();
        if (Projet_Global_Parameter.aUrlData) {
            if (Projet_Global_Parameter.aUrlData[0]) {
                if (typeof(Projet_Global_Parameter.aUrlData[0]) == undefined) {
                    // console.log('没有参数啥也不干');
                    Projet_Global_Parameter.upData = '';
                } else {
                    Projet_Global_Parameter.upData = Projet_Global_Parameter.aUrlData[0];
                    console.log('看见参数了' + Projet_Global_Parameter.upData)
                }
            }
        };
    },
    // 复制粘贴功能
    tapCopy: function($id) {
        Projet_Global_Parameter.selectText($id);
        document.execCommand('copy');
    },
    //选中文本
    selectText: function(element) {
        var text = document.getElementById(element);
        //做下兼容
        if (document.body.createTextRange) { //如果支持
            var range = document.body.createTextRange(); //获取range
            range.moveToElementText(text); //光标移上去
            range.select(); //选择
        } else if (window.getSelection) {
            var selection = window.getSelection(); //获取selection
            var range = document.createRange(); //创建range
            range.selectNodeContents(text); //选择节点内容
            selection.removeAllRanges(); //移除所有range
            selection.addRange(range); //添加range
            /*if(selection.setBaseAndExtent){
             selection.setBaseAndExtent(text, 0, text, 1);
             }*/
        } else {
            layer.msg('请稍后再试');
        }
    },
    // 校验邮箱
    isEmail: function(strEmail) {
        if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
            return true;
        } else {
            return false;
        }
    },
    // 检查用户信息
    getCheckRoleId: async function(gameId) {
        var res = await instance.get('/first-year/check-role-id', {
            params: {
                user_id: gameId
            }
        });
        // console.log(res.data)
        var data = res.data.data;

        if (res.data.code == 0) {

            dialog.closeDiv();

            // 查询成功
            // layer.msg('登录成功,快去查看您的一周年精彩回顾吧!');
            layer.msg('ログインしました。「データ閲覧」からパーソナルデータをご覧ください');

            // 检查成功 从新获取用户信息
            setTimeout(function() {
                Projet_Global_Parameter.getUserInfo();
            }, 1500)
        }

        if (res.data.code == 201) {
            // 登录错误 从新输入
            dialog.alertPopLoginError();
        }
        if (res.data.code == 205) {
            // layer.msg('未查询到角色信息');
            // layer.msg('キャラクターデータが見つかりません');
        }
        if (res.data.code == 2001) {
            // layer.msg('活动已结束');
            layer.msg('キャンペーンは終了しました');
        }
        if (res.data.code == 2002) {
            // layer.msg('活动未开始');
            layer.msg('キャンペーンは始まっていません');
        }
        if (res.data.code == 2003) {
            // layer.msg('操作频繁请,秒稍后再试');
            layer.msg('操作が頻繁過ぎます。しばらくしてからお試しください');
        }
    },
    // 获取用户信息
    getUserInfo: async function() {
        var res = await instance.post('/first-year/get-user-info');
        console.log(res.data)
        var data = res.data.data;
        if (res.data.code == 0) {
            // 登陆状态
            sessionStorage.setItem('sess-isLogin', JSON.stringify(true));
            // 新老用户 //1新玩家
            sessionStorage.setItem('sess-isNew', JSON.stringify(data.user_info.is_new));
            // 分享状态
            sessionStorage.setItem('sess-isShare', JSON.stringify(data.user_info.is_share));

            console.log(data.user_info.is_watch_send)

            if (data.user_info.is_watch_send == 1) {
                $('.page2_footer_btns .btn_goLott').hide();
                $('.page2_footer_btns .btn_share').show();
            }

            // 初始化老用户 , 用户数据
            // '角色创建时间',
            $('.userregister_time').text(data.user_info.role_data.userregister_time);
            // '累计登录天数',
            $('.total_loginday,.boxCap1 .get_data1 i').text(data.user_info.role_data.total_loginday);
            // 累计登录次数
            $('.total_logincnt,.boxCap1 .get_data2 i').text(data.user_info.role_data.total_logincnt);

            // 经常打开游戏时间段',
            $('.time_label').text(data.user_info.role_data.time_label);
            // 本时间段打开次数
            $('.max_login_cnt_time').text(data.user_info.role_data.max_login_cnt_time);

            // 最多一天打开战双的次数'
            $('.max_login_cnt_daily').text(data.user_info.role_data.max_login_cnt_daily);

            // 平均每日打开战双的次数
            $('.avg_daily_logincnt,.boxCap1 .get_data3 i').text(data.user_info.role_data.avg_daily_logincnt);

            // 螺母消耗数
            if (data.user_info.role_data.total_nut == null || data.user_info.role_data.total_nut == "") {
                $('.total_nut,.boxCap2 .get_data1 i').text('0');
            } else {
                $('.total_nut,.boxCap2 .get_data1 i').text(data.user_info.role_data.total_nut);
            }

            // '宿舍币消耗数',
            if (data.user_info.role_data.total_dormitory_currency == null || data.user_info.role_data.total_dormitory_currency == "") {
                $('.total_dormitory_currency').text('0');
            } else {
                $('.total_dormitory_currency').text(data.user_info.role_data.total_dormitory_currency);
            }
            // '宿舍螺母消耗数',
            if (data.user_info.role_data.total_dormitory_nut == null || data.user_info.role_data.total_dormitory_nut == "") {
                $('.total_dormitory_nut').text('0');
            } else {
                $('.total_dormitory_nut').text(data.user_info.role_data.total_dormitory_nut);
            }

            // 失败最多的关卡id'
            if (data.user_info.role_data.max_fail_pve_name == null ||
                data.user_info.role_data.max_fail_pve_num == null ||
                $.trim(data.user_info.role_data.max_fail_pve_name) == "" ||
                $.trim(data.user_info.role_data.max_fail_pve_num) == ""

                ||
                data.user_info.role_data.max_finish_pve_name == null ||
                data.user_info.role_data.max_finish_pve_num == null ||
                $.trim(data.user_info.role_data.max_finish_pve_name) == "" ||
                $.trim(data.user_info.role_data.max_finish_pve_num) == "") {
                $('.txt019').html(`<span>一番、敗北が多いステージは...って敗北データが見つからないぞ。負け知らずってことか、さすがはオレの指揮官だぜ！</span>
                    <span>クリア数が一番多いステージは…ってクリアデータが見つからないぞ。…ったく！なにやってんだよ。だからオレを戦わせろって言ってんだろ</span> `);

                $('.txt019').attr('data-txt', 'nodata');
            } else {
                $('.max_fail_pve_id').text(data.user_info.role_data.max_fail_pve_name);
                // 失败最多的关卡次数'
                $('.max_fail_pve_num').text(data.user_info.role_data.max_fail_pve_num);

                // 通关最多的关卡id'
                $('.max_finish_pve_id').text(data.user_info.role_data.max_finish_pve_name);
                // 通关最多的关卡次数
                $('.max_finish_pve_num').text(data.user_info.role_data.max_finish_pve_num);
            }


            //'黑卡消耗数',
            //'血清消耗数',
            if (data.user_info.role_data.total_blackcard == null || $.trim(data.user_info.role_data.total_blackcard) == "") {
                $('.total_blackcard,.boxCap2 .get_data2 i').text('0');
            } else {
                $('.total_blackcard,.boxCap2 .get_data2 i').text(data.user_info.role_data.total_blackcard);
            }
            if (data.user_info.role_data.total_serum == null) {
                $('.total_serum,.boxCap2 .get_data3 i').text('0');
            } else {
                $('.total_serum,.boxCap2 .get_data3 i').text(data.user_info.role_data.total_serum);
            }

            // 爱抚最多
            if (data.user_info.role_data.maxcaress_character_id == null || $.trim(data.user_info.role_data.maxcaress_character_id) == "") {
                heros.maxcaress_character_id = '1021001';
                $('.boxCap3 .get_data1 i').text('ルシア 紅蓮');
            } else {
                heros.maxcaress_character_id = data.user_info.role_data.maxcaress_character_id;
                $('.boxCap3 .get_data1 i').text(data.user_info.role_data.maxcaress_character_name);
            }

            if (data.user_info.role_data.maxcaress_character_num == null || $.trim(data.user_info.role_data.maxcaress_character_num) == "") {
                heros.maxcaress_character_num = 1;
                $('.boxCap3 .get_data2 i').text('1');
            } else {
                heros.maxcaress_character_num = data.user_info.role_data.maxcaress_character_num;
                $('.boxCap3 .get_data2 i').text(data.user_info.role_data.maxcaress_character_num);
            }

            // 分享图中数据
            // $('.boxCap3 .get_data1 i').text(data.user_info.role_data.maxcaress_character_name);
            // $('.boxCap3 .get_data2 i').text(data.user_info.role_data.maxcaress_character_num);




            // 最少爱抚
            if (data.user_info.role_data.mincaress_character_id == null || $.trim(data.user_info.role_data.mincaress_character_id) == "") {
                heros.mincaress_character_id = '1051001';
            } else {
                heros.mincaress_character_id = data.user_info.role_data.mincaress_character_id;
            }

            if (data.user_info.role_data.mincaress_character_num == null || $.trim(data.user_info.role_data.mincaress_character_num) == "") {
                heros.mincaress_character_num = 1;
            } else {
                heros.mincaress_character_num = data.user_info.role_data.mincaress_character_num;
            }

            // heros.mincaress_character_id = data.user_info.role_data.mincaress_character_id;
            // heros.mincaress_character_num = data.user_info.role_data.mincaress_character_num;


            // 出击最多的构造体

            if (data.user_info.role_data.use_character_id == null || $.trim(data.user_info.role_data.use_character_id) == "") {
                heros.use_character_id = '1051001';
                $('.boxCap3 .get_data3 i').text('ルシア 紅蓮');
            } else {
                heros.use_character_id = data.user_info.role_data.use_character_id;
                $('.boxCap3 .get_data3 i').text(data.user_info.role_data.use_character_name);
            }

            if (data.user_info.role_data.use_character_num == null || $.trim(data.user_info.role_data.use_character_num) == "") {
                heros.use_character_num = 1;
                $('.boxCap3 .get_data4 i').text('1');
            } else {
                heros.use_character_num = data.user_info.role_data.use_character_num;
                $('.boxCap3 .get_data4 i').text(data.user_info.role_data.use_character_num);
            }



            // 分享图中数据
            // $('.boxCap3 .get_data3 i').text(data.user_info.role_data.use_character_name);
            // $('.boxCap3 .get_data4 i').text(data.user_info.role_data.use_character_num);

        }
    },
    // 观看回调
    watchPlay: async function() {
        var res = await instance.post('/first-year/watch');
        console.log(res.data)
        if (res.data.code == 0) {
            console.log('观看回调 - ok')
        }
    },
    // 发奖回调
    presentLott: async function() {
        var res = await instance.post('/first-year/present');
        console.log(res.data)
        if (res.data.code == 0) {
            console.log('发奖回调 - ok')

            // 领奖成功后 弹出打开游侠弹框
            if (res.data.data.user_info.is_watch_send == 1 && res.data.data.user_info.is_share_send != 1) {

                if (res.data.data.user_info.is_new == 0) {
                    dialog.alertPopLottend('type-old');
                } else {
                    dialog.alertPopLottend('type-new');
                }
            }

            // 首次分享领奖
            if (res.data.data.user_info.is_share_send == 1) {
                // layer.msg('分享成功奖励,已发放,请到游戏内查看');
                layer.msg('シェア報酬を配布しました。パニグレにログインしてご査収ください');
            }

            $('.page2_footer_btns .btn_goLott').hide();
            $('.page2_footer_btns .btn_share').show();
        }
        if (res.data.code == 202) {
            // layer.msg('奖励已发放');
            layer.msg('報酬を配布しました');
        }
        if (res.data.code == 203) {
            // layer.msg('未达到奖励发放条件');
            layer.msg('報酬受取り条件を満たしていません');
        }
        if (res.data.code == 204) {
            // layer.msg('发放失败，请稍后再试');
            layer.msg('发放失败，请稍后再试');
        }
        if (res.data.code == 205) {
            // layer.msg('未查询到角色信息');
            layer.msg('キャラクターデータが見つかりません');
        }
        if (res.data.code == 206) {
            // layer.msg('bdc接口请求失败，请稍后再试');
            layer.msg('データリクエストエラーが発生しました。しばらくしてからお試しください');
        }
    },
    // 分享回调
    twshare: async function() {
        var res = await instance.post('/first-year/share');
        console.log(res.data)
        if (res.data.code == 0) {
            console.log('分享回调 - ok');
            console.log('res.data.data.user_info.is_share_send' + res.data.data.user_info.is_share_send)
            if (res.data.data.user_info.is_share_send == 0) {
                Projet_Global_Parameter.presentLott();
            } else {
                layer.msg('すでにシェア報酬を配布済みです。繰り返しシェアしても報酬は配布されません');
            }
        }
    },
    // 相加函数
    add: function(a, b) {
        return a + b
    }
}

export default Projet_Global_Parameter