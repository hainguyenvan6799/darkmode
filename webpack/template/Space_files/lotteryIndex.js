/* eslint-disable no-undef */
(function() {
  'use strict';

  // 変数で保持するデータを管理する
  var state = {
    customizeName: 'cybozu.garoon.lottery',
    get datastore() {
      return garoon.schedule.event.datastore.get(state.customizeName);
    },
    get datastoreValue() {
      var datastore = state.datastore;
      return datastore && datastore.value;
    },
  };

  // garoon API 関連のツールをまとめたもの
  var api = {
    /**
     * datastore を更新する
     * @param  {text} method - Rest のメソッド
     * @param  {object} param - value に入れる内容
     * @return {object} - Rest のレスポンス
     */
    saveLotteryResult: function(method, param) {
      var url = '/api/v1/schedule/events/' + param.id + '/datastore/' + state.customizeName;
      var objjson = {
        '__REQUEST_TOKEN__': garoon.base.request.getRequestToken(),
        value: param
      };
      return garoon.api(url, method, objjson).then(function(res) {
        return res;
      });
    },
    /**
     * datastore を更新する準備を行い、更新実行メソッドを呼ぶ
     * @param  {array} winnerLists - 当選者のリスト(当選内容, 氏名)
     * @return {object} - Rest のレスポンス
     */
    readySaveLotteryResult: function(winnerLists) {
      var datastoreValue = state.datastoreValue;
      // datastore に値がなければ POST、 あれば PUT
      var method = datastoreValue ? 'PUT' : 'POST';
      var param = {lotteries: []};

      // datastore 内の値を取得
      if (datastoreValue) {
        param.lotteries = datastoreValue.lotteries;
      }

      // datastore 内の値と今回の抽選結果の値を結合する
      param.lotteries = param.lotteries.concat(winnerLists);
      param.id = garoon.schedule.event.get().id;

      // datastore を更新する
      return api.saveLotteryResult(method, param);
    },
    /**
     * 当選者を表示する SweetAlert を起動する
     * @param  {array} swalDetails - 当選者のリスト(当選内容, 氏名)
     * @param  {array} index - 表示する配列の inedx
     * @param  {array} targets - 抽選対象のリスト
     */
    showWinners: function(lotteriesItems, winnerLists) {
      // 抽選結果を表示する
      Swal.fire({
        html: '<div id="lottery_result_dialog">',
        confirmButtonText: '閉じる',
        allowOutsideClick: false,
      // いづれかのボタンクリック時
      }).then(function(result) {
        // 画面をリロードする
        location.reload();
      });

      // 抽選の確認ダイアログ
      new Vue({
        el: '#lottery_result_dialog',
        data: {
          lotteriesItems: lotteriesItems,
          winnerLists: winnerLists,
          isShowResult: false
        },
        mounted: function() {
          document.querySelector('.swal2-confirm.swal2-styled').style.display = 'none';
          // アニメーション表示は 3秒間
          setInterval(() => {
            document.querySelector('.swal2-confirm.swal2-styled').style.display = 'block';
            this.isShowResult = true;
          }, 3000);
        },
        template: '' +
        '<div id="swal2-content" style="display: block;">' +
          // 抽選中
          '<div v-if="!isShowResult">' +
            '<div class="base_lottery_grn_plugin">' +
              '<div style="width: 128px; position: relative; margin: 5px auto 15px;">' +
              '<div class="icon_lottery_roulette_1_grn_plugin"></div>' +
              '<div class="icon_lottery_roulette_2_grn_plugin roulette_rotation_grn_plugin"></div>' +
            '</div>' +
            '<div style="margin: 10px 0;" class="bold_grn_plugin">抽選中...</div>' +
              '<ul class="confirm_dialog_ul_grn_plugin" v-for="(lotteriesItem, index) in lotteriesItems">' +
                  '<li class="confirm_dialog_li_grn_plugin">{{lotteriesItem}}</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          // 抽選結果
          '<div v-else>' +
            '<div class="base_lottery_grn_plugin">' +
              '<div class="icon_lottery_roulette_3_grn_plugin"></div>' +
              '<h3 class="visually_hidden_grn_plugin">抽選結果</h3>' +
              '<div class="lottery_result_base_grn_plugin" >' +
                '<template v-for="(winnerList, index) in winnerLists">' +
                  '<h4 class="lottery_result_item_grn_plugin">{{winnerList.title}}</h4>' +
                  '<ul class="lottery_result_ul_grn_plugin">' +
                    '<li class="lottery_result_li_grn_plugin" v-for="(user, index) in winnerList.users">' +
                      '<span class="icon_user_general_2_grn_plugin icon_inline_s_grn_plugin"></span>{{user.name}}' +
                    '</li>' +
                  '</ul>' +
                '</template>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      });
    }
  };

  // 描写関連のツールをまとめたもの
  var view = {
    // 抽選実行フォーム
    renderLotterySetting: function(ev, users) {
      // 抽選入力テーブル
      var lotteryList = {
        props: ['index', 'maxPeople', 'lottery'],
        methods: {
          doAddLottery: function() {
            this.$emit('add_lottery', this.index);
          },
          doRemoveLottery: function() {
            this.$emit('remove_lottery', this.index);
          },
          onChange: function() {
            this.$emit('validation_check');
          },
        },
        template: '' +
          '<li class="lottery_item_grn_plugin">' +
            // 抽選内容
            '<input type="text" v-model="lottery.title" @input="onChange" class="lottery_title input_text_grn_plugin v_align_middle_grn_plugin" ' +
              'style="width: 400px;" placeholder="抽選内容" aria-label="抽選内容">' +
            // 人数
            '<select v-model="lottery.people" @change="onChange" class="input_text_grn_plugin v_align_middle_grn_plugin" ' +
              'style="margin-left: 10px;" aria-label="抽選人数">' +
              '<option v-for="n of maxPeople" :value="n">{{n}}人</option>' +
            '</select>' +
            // 追加ボタン
            '<span @click="doAddLottery" class="action_button_base_grn_plugin v_align_middle_grn_plugin inline_block_grn_plugin" ' +
              'style="margin-right: 2px; margin-left: 5px;">' +
              '<button type="button" class="action_base_grn_plugin button_style_off_grn_plugin" title="項目を追加">' +
                '<span class="icon_add_2_grn_plugin icon_inline_grn_plugin icon_only_grn_plugin"></span>' +
              '</button>' +
            '</span>' +
            // 削除ボタン
            '<span v-if="index>0" @click="doRemoveLottery" ' +
              'class="action_button_base_grn_plugin v_align_middle_grn_plugin inline_block_grn_plugin">' +
              '<button type="button" class="action_base_grn_plugin button_style_off_grn_plugin" title="項目を削除">' +
              '<span class="icon_delete_2_grn_plugin icon_inline_grn_plugin icon_only_grn_plugin"></span>' +
              '</button>' +
            '</span>' +
          '</li>'
      };

      // 当選者の名前の表示
      var usernameItem = {
        props: ['user', 'index'],
        computed: {
          displayname: function() {
            return this.user.name;
          }
        },
        template:
        '<li class="lottery_result_li_grn_plugin">' +
          '<span class="icon_user_general_2_grn_plugin icon_inline_s_grn_plugin"></span>' +
          '{{this.displayname}}' +
        '</li>'
      };

      // 抽選結果
      var lotteryResultItem = {
        props: ['result'],
        components: {
          'username-item': usernameItem
        },
        template: '' +
          '<div style="margin-bottom: 5px;">' +
            // 抽選名
            '<div class="lottery_result_item_grn_plugin">' +
              '{{result.title}}：' +
            '</div>' +
            // 当選者の名前
            '<ul class="lottery_result_ul_grn_plugin">' +
              '<username-item v-for="(user, index) in result.users" :user="user" :index="index"/>' +
            '</ul>' +
          '</div>'
      };

      return new Vue({
        el: '#garoon_lottery_setting',
        components: {
          'lottery-list': lotteryList,
          'lottery-result': lotteryResultItem,
        },
        mounted: function() {
        },
        data: {
          lotteryResults: state.datastoreValue ? state.datastoreValue.lotteries : [],
          isOpenForm: false,
          maxPeople: users.length,
          isOnlyAttendees: false,
          lotteries: [
            {
              title: '',
              people: 1,
            }
          ],
          useAttendanceCheck: ev.useAttendanceCheck,
        },
        computed: {
          validationCheck: function() {
            var sumTargetsPeople = 0;
            var lotteriesItems = [];
            var targets;
            var lotteries = this.lotteries.filter(function(lottery) {
              // タイトルが未入力の行を除外する
              return lottery.title;
            });

            // 抽選ボタンを使用不可にする
            this.canLottery = false;

            lotteries.forEach(function(lottery) {
              // 抽選する人数の合計を算出する
              sumTargetsPeople += lottery.people;
              lotteriesItems.push(lottery.title + ' (' + lottery.people + '人)');
            });

            // 抽選のタイトルが入力された行が存在しないとき
            // ※「抽選を始める」は使用不可だが、エラーは表示しない
            if (lotteries.length < 1) {
              return '';
            }

            // 「出席者のみで抽選を行う」場合は、出席者に限定する
            targets = users;
            if (this.isOnlyAttendees) {
              targets = users.filter(function(user) {
                return user.attendanceResponse.status === 'ACCEPTED';
              });
            }

            // 抽選を行う人数が、抽選対象より多い場合はエラーを表示する
            if (targets.length < sumTargetsPeople) {
              return '抽選を行う人数(' + sumTargetsPeople + '人)が、抽選の対象者の人数(' + targets.length + '人)よりも多いです';
            }

            return null;
          },
          canLottery: function() {
            return this.validationCheck === null;
          },
          displayArialive: function() {
            return this.validationCheck ?
              'margin: 10px 0 12px; display: block;' :
              'margin: 10px 0 12px; display: none;';
          },
        },
        methods: {
          openFormLottery: function() {
            this.isOpenForm = true;
            this.$nextTick(function() {
              document.querySelectorAll('.lottery_title')[0].focus();
            });
          },
          closeFormLottery: function() {
            this.isOpenForm = false;
          },
          // 抽選入力テーブルの行の追加
          addLottery: function(index) {
            this.lotteries.splice(index + 1, 0, {title: '', people: 1});
            this.$nextTick(function() {
              document.querySelectorAll('.lottery_title')[index + 1].focus();
            });
          },
          // 抽選入力テーブルの行の削除
          removeLottery: function(index) {
            this.lotteries.splice(index, 1);
          },
          // 抽選を行う
          runLottery: function(el) {
            var targets;
            var targetsRemain;
            var lotteriesItems = [];
            var i;
            var winindex;
            var winusers;
            var winnerLists = [];
            var lotteries = this.lotteries.filter(function(lottery) {
              // タイトルが未入力の行を除外する
              return lottery.title;
            });

            lotteries.forEach(function(lottery) {
              lotteriesItems.push(lottery.title + ' (' + lottery.people + '人)');
            });

            // 参加者の名前を半角セミコロンで区切る
            targets = users.map(function(target) {
              target.name = target.name.split(/;/)[0];
              return target;
            });

            // 「出席者のみで抽選を行う」場合は、出席者に限定する
            if (this.isOnlyAttendees) {
              targets = targets.filter(function(user) {
                return user.attendanceResponse.status === 'ACCEPTED';
              });
            }

            // 抽選対象者者の残数を管理する変数
            targetsRemain = targets.concat();

            // 抽選の確認メッセージを表示する
            Swal.fire({
              html: '<div id="lottery_confirmation_dialog">',
              showCancelButton: true,
              confirmButtonText: 'OK',
              cancelButtonText: '閉じる',
            // いづれかのボタンクリック時
            }).then(function(result) {
              // Cancel をクリックした場合は中断する
              if (!result.value) {
                return false;
              }

              // 抽選を実行する。当選内容は winnerLists に蓄積される。
              winnerLists = lotteries.map(function(lottery) {
                winusers = [];
                for (i = 0; i < lottery.people; i += 1) {
                  winindex = Math.floor(Math.random() * targetsRemain.length);
                  winusers.push(targetsRemain[winindex]);
                  targetsRemain.splice(winindex, 1);
                }
                return {
                  title: lottery.title,
                  users: winusers
                };
              });

              // datastore に抽選結果を記録する
              return api.readySaveLotteryResult(winnerLists).then(function() {
                // 当選者を表示する
                api.showWinners(lotteriesItems, winnerLists);
              });
            });

            // 抽選の確認ダイアログ
            new Vue({
              el: '#lottery_confirmation_dialog',
              data: {
                lotteriesItems: lotteriesItems
              },
              template: '' +
              '<div id="swal2-content" style="display: block;">' +
                '<div class="base_lottery_grn_plugin">' +
                  '<div style="width: 128px; position: relative; margin: 5px auto 15px;">' +
                    '<div class="icon_lottery_roulette_1_grn_plugin"></div>' +
                    '<div class="icon_lottery_roulette_2_grn_plugin"></div>' +
                  '</div>' +
                  '<div style="margin: 10px 0;" class="bold_grn_plugin">以下の内容で抽選を行います。よろしいですか？</div>' +
                    '<ul class="confirm_dialog_ul_grn_plugin">' +
                      '<li class="confirm_dialog_li_grn_plugin" v-for="(lotteriesItem, index) in lotteriesItems">' +
                        '{{lotteriesItem}}' +
                      '</li>' +
                    '</ul>' +
                  '</div>' +
                '</div>' +
              '</div>'
            });
          },
        },
        template: '' +
          '<div class="base_lottery_grn_plugin">' +
            // 抽選結果
            '<div v-if="lotteryResults.length > 0">' +
                '<lottery-result v-for="result in lotteryResults" :result="result"/>' +
            '</div>' +
            // 抽選入力フォーム
            '<div v-if=isOpenForm>' +
              // 説明
              '<div v-if="lotteryResults.length > 0" class="border_dashed_separator_grn_plugin" style="margin-bottom: 10px;"></div>' +
              '<div style="margin-bottom: 15px;">' +
                '<span class="icon_s_grn_plugin icon_information_2_grn_plugin information_icon_base_grn_plugin"></span>' +
                '<span class="message_text_grn_plugin">抽選結果は変更・削除ができません。抽選をやり直す場合は、再度抽選を設定してください。</span>' +
              '</div>' +
              // 抽選詳細
              '<ul class="ul_grn_plugin">' +
                '<lottery-list v-for="(lottery, index) in lotteries"' +
                  ':index="index" :lottery="lottery" :maxPeople="maxPeople" ' +
                  '@add_lottery="addLottery" @remove_lottery="removeLottery" @validation_check="this.validationCheck">' +
                '</lottery-list>' +
              '</ul>' +
              // エラーの表示
              '<div :style="this.displayArialive" role="alert" aria-live="assertive">' +
                '<span class="icon_s_grn_plugin icon_attention16_grn_plugin"></span>' +
                '<span class="message_text_grn_plugin attention_message_grn_plugin bold_grn_plugin">{{ this.validationCheck }}</span>' +
              '</div>' +
              // 抽選対象を出席者に限定する
              '<div v-if="useAttendanceCheck" style="margin-bottom: 10px;">' +
                '<label>' +
                  '<input type="checkbox" v-model="isOnlyAttendees" class="checkbox_grn_plugin">' +
                    '抽選対象を出席者に限定する(出欠確認予定のみ)' +
                '</label>' +
              '</div>' +
              // ボタン
              '<div style="margin-top: 25px;">' +
                // 抽選を始める
                '<button type="button" name="" value="" :disabled="!canLottery" @click="runLottery" ' +
                  'class="button_main_grn_plugin button_r_margin2_grn_plugin">' +
                  '抽選を始める' +
                '</button>' +
                // キャンセルする
                '<button type="button" name="" value="" @click="closeFormLottery" class="button_normal_grn_plugin">' +
                  'キャンセルする' +
                '</button>' +
              '</div>' +
            '</div>' +
            // 抽選を設定する ※ まだ抽選を行っていない場合
            '<div v-if="!isOpenForm && (lotteryResults.length === 0)" class="base_lottery_grn_plugin">' +
              '<button type="button" class="button_style_off_grn_plugin button_text_style_grn_plugin" @click="openFormLottery">' +
                '<span class="icon_lottery_2_grn_plugin icon_inline_grn_plugin"></span>' +
                '<span class="icon_inline_text_grn_plugin">抽選を設定する</span>' +
              '</button>' +
            '</div>' +
            // 抽選を設定する ※ すでに抽選を行っている場合
            '<div v-if="!isOpenForm && (lotteryResults.length > 0)">' +
              '<div class="border_dashed_separator_grn_plugin" style="margin-bottom: 10px;"></div>' +
              '<button type="button" class="button_style_off_grn_plugin button_text_style_grn_plugin" @click="openFormLottery">' +
                '<span class="icon_lottery_2_grn_plugin icon_inline_grn_plugin"></span>' +
                '<span class="icon_inline_text_grn_plugin">新しい抽選を設定する</span>' +
              '</button>' +
              '<span class="lottery_result_info_grn_plugin">' +
                '<span class="icon_s_grn_plugin icon_information_2_grn_plugin information_icon_base_grn_plugin"></span>' +
                '<span class="message_text_grn_plugin">抽選結果は変更・削除ができません。抽選をやり直す場合は、再度抽選を設定してください。</span>' +
              '</span>' +
            '</div>' +
          '</div>'
      });
    },
  };

  // スケジュールの詳細表示
  garoon.events.on('schedule.event.detail.show', function(ev) {
    // 参加者から type が USER のものを取得する
    var users = ev.event.attendees.filter(function(attendee) {
      return attendee.type === 'USER';
    });

    // スケジュールコピー後に、抽選の datastore が残っていれば削除する
    if (state.datastoreValue) {
      if (state.datastoreValue.id !== ev.event.id) {
        garoon.api('/api/v1/schedule/events/' + ev.event.id + '/datastore/' + state.customizeName,
          'DELETE',
          {value: []}).then(function() {
          location.reload();
        }
        );
      }
    }

    // 抽選フォーム表示用の行を追加する
    garoon.schedule.event.insertTableRow(
      '抽選',
      '<div id="garoon_lottery_setting" />',
      'NOTES'
    );

    // 抽選フォームを表示する
    view.renderLotterySetting(ev.event, users);
  });

})();