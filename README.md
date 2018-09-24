# jquery-laravel-validation
Submit Ajax forms to Laravel Validate with jQuery

## Dependências
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/alertify.min.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/css/themes/default.min.css"/>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.11.1/build/alertify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@1.5.4/src/loadingoverlay.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@1.5.4/extras/loadingoverlay_progress/loadingoverlay_progress.min.js"></script>
<script src="laravelValidator.js"></script>
```

## Tipos de responses feitos pelo Controller ao formulário
As responses são 4 tipos ao todo: Validação do Laravel, Javascript, Alert, Alertify, e Bootstrap Modal


### Validação do Laravel / Mensagens de erros dos campos
Esta validação é através do FormRequest do Laravel. Veja a documentação https://laravel.com/docs/5.6/validation#creating-form-requests


### Javascript
```php
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Requests\AcessoRequest;

class AcessoController extends Controller{
    public function store(AcessoRequest $request){
        // do somethings
        return response()->json([
           'type' => 'javascript',
           'javascript' => "alert('alert displayed')",
       ]);
    }
}
```

### Alert
```php
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Requests\AcessoRequest;

class AcessoController extends Controller{
    public function store(AcessoRequest $request){
        // do somethings
        return response()->json([
             'type' => 'alert', //required to identify
             'alert' => [
                 'title' => 'Header', //optional
                 'message' => '<p>HTML allowed<p>', //required

                 // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
                 'callback'=> 'alertify.success('Ok');',  //optional
             ],
         ]);
    }
}

```

### Notify
```php
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Requests\AcessoRequest;

class AcessoController extends Controller{
    public function store(AcessoRequest $request){
        // do somethings
        return response()->json([
             'type' => 'notify', //required to identify
             'notify' => [
                 'message' => '<p>HTML allowed<p>',
                 'type' => 'warning', // warning, success, message, error
                 'wait'=> 5,

                 // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
                 'callback'=> 'console.log('dismissed');'
             ],
         ]);
    }
}
```

### Bootstrap v3.3.7 Modal
```php
<?php
namespace App\Http\Controllers;
use Illuminate\Http\Requests\AcessoRequest;

class AcessoController extends Controller{
    public function store(AcessoRequest $request){
        // do somethings
        return response()->json([
             'type' => 'bs3.modal',
             'bs3.modal' => [
                'title'=> 'Modal title',
                'content'=> '<p>HTML allowed<p>',
                'closeIcon'=> true, // default: true
                'closeButton'=> true, // default: true
                'buttons'=> [
                    [
                        'text'=> 'I agree', 
                        'id'=> uniqid(), 

                        // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
                        'click'=> "alert('You did agree with terms!');",
                    ],
                ],
             ],
         ]);
}
```

## Exemplo
Criar um formulário comum usado a estrutura do Bootstrap v3.3.7, e inicializar o plugin no elemento domformulário

### Formulário
```php
<?= Form::open(['action' => 'AcessoController@store', 'id' => 'validar_aluno']) ?>
<div class="row">    
    <!-- ALUNO -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="aluno_nome">Nome do(a) aluno(a)</label>
            <?= Form::text('aluno_nome', null, ['class' => 'form-control', 'placeholder' => 'Nome do(a) aluno(a)']) ?>
        </div>
        <div class="form-group">
            <label for="aluno_nascimento">Nascimento do(a) aluno(a)</label>
            <?= Form::text('aluno_nascimento', null, ['class' => 'form-control', 'placeholder' => 'Nascimento do(a) aluno(a)']) ?>
        </div>
    </div>

    <!-- RESPONSÁVEL -->
    <div class="col-md-6">
        <div class="form-group">
            <label for="mae_nome">Mãe do(a) aluno(a)</label>
            <?= Form::text('mae_nome', null, ['class' => 'form-control', 'placeholder' => 'Mãe do(a) aluno(a)']) ?>
        </div>
    </div>
    <div class="col-md-6">
        <br>
        <p><button class="btn btn-primary">ACESSAR</button></p>
    </div>
</div>
<?= Form::close() ?>

<script>
$(document).ready(function () {
    alertify.set('notifier', 'position', 'top-right');
    var $form = $('#validar_aluno').laravelValidator();
});
</script>
```
