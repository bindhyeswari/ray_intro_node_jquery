/**
 *
 * Utilities
 *
 * */

var utilities = {
    getJSON: function (url, success, error) {
        console.log('getting data from ' + url);
        // makes an AJAX call and requests for JSON information
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.addEventListener('readystatechange', function () {
            if ( xhr.readyState === 4 ) {
                console.log(xhr.responseText);
                if ( xhr.status === 200 ) {
                    success(JSON.parse(xhr.responseText));
                } else {
                    error(xhr);
                }
            }
        });
        xhr.send();
    },
    postJSON: function(url, data, success, error){
        var xhr = new XMLHttpRequest();
        console.log(data);
        xhr.open('POST', url);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('readystatechange', function () {
            if ( xhr.readyState === 4 ) {
                console.log(xhr.responseText);
                if ( xhr.status === 200 ) {
                    success(JSON.parse(xhr.responseText));
                } else {
                    error(xhr);
                }
            }
        });
        xhr.send(JSON.stringify(data));
    },

    createElement: function (type, parent, html, className) {
        var elem = document.createElement(type);
        elem.innerHTML = html;
        elem.className = className;
        if (parent) parent.appendChild(elem);
        return elem;
    },

    getFormJSON: function (formName) {
        var form = document.forms[formName];
        var obj = {};
        obj.title = form.title.value;
        obj.author = form.author.value;
        return obj;
    },

    createQuestionView: function(question, parent) {
        var self = this;
        var li_question = this.createElement('li', null, '', 'question');
        this.createElement('div', li_question, question.question, 'question');
        var ul_options = this.createElement('ul', li_question, '', 'options');
        question.options.forEach(function (option) {
            self.createElement('li', ul_options, option, 'option')
        });
        if (parent) parent.appendChild(li_question);
        return li_question;
    }
};

/**
*
* Get List of all tests and display them to the user
*
* */

function listTests() {
    utilities.getJSON('/tests', function (list_tests) {
        var ul = document.getElementById('ul_tests_list');
        list_tests.forEach(function (test) {
            utilities.createElement('li', ul, test.title +
                ( test.author ? ' by ' + test.author : '' ),
                ''
            )
        });
    }, function (xhr) {
        console.log(xhr.status + ': ' + xhr.responseText);
    });
}

/**
 *
 * Create a test
 *
 * */


// Deals with adding questions to the test
var form_test = document.forms['frm_create_test'];
form_test['option4'].addEventListener('keydown', function (event) {
    if ( event.keyCode === 13 ) {

        // create the
        var options = [];
        for (var i = 0; i < 4; i++) {
            options.push(form_test['option' + ( i + 1 )].value);
        }

        // create the question object
        var question = {
            question: form_test['question'].value,
            options: options
        };

        console.log(utilities.createQuestionView(question, document.getElementById('ul_created_questions')));
        form_test.reset();
    }


});


form_test.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('submit prevented!!!');
    var formJSON = utilities.getFormJSON('frm_create_test');

    console.log(formJSON);

    console.log(formJSON);
    document.getElementById('message').className = '';
    utilities.postJSON('/tests',
        utilities.getFormJSON('frm_create_test'),
        function (obj) {
            console.log(obj);
        },
        function (xhr) {
            document.getElementById('message').className = 'show';
            console.log(xhr.status + ': ' + xhr.responseText);
        }
    );
});


/**
 *
 * Take a test
 *
 * */



/**
*
* Initialize Page
*
* */

function page_init() {
    console.log('listing tests ... ');
    listTests();
}

page_init();




