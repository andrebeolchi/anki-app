# Global Storage

Podemos usar o hook `useStorage` para guardar dados de forma global, acessivel em qualquer lugar da aplicação que esteja dentro do `StorageProvider`.

Esse componente espera receber um adapter para persistência de dados, que precisa exportar 4 métodos:

- **getAll**: para retornar todos os dados persistidos
- **set**: para persistir um novo dado, esperando dois parâmetros (`key`, `value`)
- **remove**: que espera `key` como parâmetro e remove o item da persistencia
- **clear**: que limpa os dados persistidos.

> [!NOTE]
> Temos dois adapters atualmente: _in-memory_ e [mmkv](https://github.com/mrousavy/react-native-mmkv).

Já o `StorageProvider` espera `adapter` como sendo um objeto com esses 4 parâmetros. Outro ponto relevante, é que o Provider, ao ser carregado fará a reidratação da memória com os dados persistido, e alterará o valor `isRehydrated` para `true` (inicialmente ele é `false`).

Temos ainda outros dois componentes: `StorageLoader` e `StorageChildren`, que devem ser usados para gerenciar o conteúdo a ser passado como children para que o Provider possa fazer a condicional que mostra um ou outro com base no estado de reidratação.

Exemplo e uso:

```js
import { storage } from '~/comonents/storage/adapters/mmkv'

<StoragerProvider adapter={storage()}>
  <StorageLoader>Loading...</StorageLoader>
  <StorageChildren>Olá Mundo!</StorageChildren>
</StorageProvider>
```

O `StorageProvider` pode receber também um parâmetro `initialValues`, que será usado como valores padrão para quando não existir dados na persistência. Esse parâmetro espera receber um objeto.
