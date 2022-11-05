const express = require('express')
const mysql = require('mysql2')
const path = require('path') //경로
const static = require('serve-static') // 경로
const dbconfig = require('./config/dbconfig.json') // 파일 읽어서 dbconfig에 받음

// Database connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database, //이런 방식으로 하면 노출을 안할 수 있다.
    debug: false
})

const app = express() // 웹 서버가 생김
app.use(express.urlencoded({extended:true}))
app.use(express.json()) // 웹 브라우저가 json형태로 보낼 때도 볼 수 있다, 정보들을 나누어서 받을 수 있다.
app.use('/public', static(path.join(__dirname, 'public'))); // 현재 디렉토리에 public이라는 걸 합쳐서 하나의 디렉토리를 만드는데 그것이 public이다, 디렉토리 지정

app.post('/process/adduser', (req, res) => { // '/process/adduser로 req받은 것을 처리하는 곳
    console.log('/process/adduser 호출됨 '+req)

    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    pool.getConnection((err, conn) => { // conn은 db와 연결되어 있는 하나의 끈
        if (err) {
            console.log('Mysql getConnection error. aborted'); // db와 커넥션이 안됨
            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
            res.write('<h1>DB 서버 연결 실패</h1>')
            res.end();
            conn.release(); // err가 있으면 바로 release
            return;
        }

        const excv = conn.query('select `id`, `name` from `users` where `id`=? and `password`=?',
                    [paramId, paramPassword],
                    (err, rows) => {
                        conn.release();
                        console.log('실행된 SQL query: '+excv.sql);

                        if (err) {
                            console.dir(err);
                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h1>sql query 실행 실패</h1>')
                            res.end();
                            return;
                        }

                        if (rows.length > 0) {
                            console.log('아이디 [%s], 패스워드가 일치하는 사용자 [%s] 찾음', paramId, rows[0].name);
                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h2>로그인 성공</h2>')
                            res.end();
                            return;
                        }
                        else {
                            console.log('아이디 [%s], 패스워드가 일치없음', paramId);
                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h2>로그인 실패. 아이디와 패스워드를 확인하세요</h2>')
                            res.end();
                            return;
                        }
                    }
        )

        console.log('데이터베이스 연결 끈 얻었음..'); // 에러가 아니므로

        const exec = conn.query('insert into users(id, name, age, password) values (?,?,?,?);', // sql쿼리문 사용 가능
                    [paramId, paramName, paramAge, paramPassword],
                    (err, result) => {
                        conn.release();
                        console.log('실행된 SQL: ' +exec.sql) // 서버로 보냈던 sql쿼리가 전부 값으로 치환

                        if(err) {
                            console.log('SQL 실행시 오류 발생')
                            console.dir(err);
                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h1>sql query 실행 실패</h1>')
                            res.end();
                            return;
                        }

                        if (result) {
                            console.dir(result)
                            console.log('Inserted 성공')

                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h2>사용자 추가 성공</h2>')
                            res.end();
                        }
                        else {
                            console.log('Inserted 실패')

                            res.writeHead('200', {'Content-Type' : 'text/html; charset=utf8'})
                            res.write('<h1>사용자 추가 실패</h1>')
                            res.end();
                        }

                        
                    }
        )
    })
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})