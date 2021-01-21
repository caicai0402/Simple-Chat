



# HW8 Review Result

## 是否被判斷為屍體code？


no
## 沒有review別人？


yes
## Review 1

### 是否大致符合作業要求


大致符合
### 簡單評論


功能很完整(query, mutation, subscription, 註冊, filter 使用者, error handling 等)，但是有幾個問題
1. 如果自己傳給自己訊息會出問題
2. 密碼全部用明文存在DB裡面
3. graphql server 沒有用密碼驗證，任何人都可以直接對 server request，拿到別人的訊息或密碼，密碼沒有任何意義。關於 authentication 可以看官方教學 https://www.apollographql.com/docs/apollo-server/security/authentication/
4. 登入的時候的 password  只要觸發 onChange 就會送出一次 request，username 也會有類似的情況(登錄前和登入後都會，不過只要 username 在 cache 裡面就不會送 request）
5. mutation 中很多 resolver 都沒必要的進行兩次 db request，像是findOneAndDelete，不需要確認 message 是否存在，檢查 promise resolve 是否是 null 就可以知道有沒有 match。(If no documents match the specified query, the promise resolves to null.; src: https://docs.mongodb.com/realm/mongodb/actions/collection.findOneAndDelete)
6. 目前 subscription 的寫法 a 傳給 b 的時候，c 會拿到內容，而且是直接印在 console
7. 只有自己傳訊息給別人，別人才會變成 friend，左邊才會出現那個人。當透過 subscription 接到訊息之後，那個人可能還不是 friend，不會出現在 List
8. 不是所有東西 await 都有意義，useState 的 update function 不是回傳 thenable，await undefine 不能改變任何執行順序，所以await setTalk_to 沒有意義
### 是否值得當作範例


還好
## Review 2

### 是否大致符合作業要求


大致符合
### 簡單評論


超棒，功能齊全，而且有把login做出來，旁邊的mailbox也很有巧思
### 是否值得當作範例


他超棒，可以當作範例!