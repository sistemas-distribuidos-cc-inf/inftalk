#include <iostream>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdlib.h>
#include <unistd.h>

using namespace std;

int main()
{
    /* ---------- INICIALIZANDO VARIÁVEIS ---------- */

    /*  
       1. client / server são dois descritores de ficheiros
       essas duas variáveis ​​armazenam os valores retornados
       pela chamada de conexão com o servidor e pela chamada
       do sistema de aceitação da conexão.

       2. portNum armazena o número da porta na qual foi estabelecida
       a conexão.

       3. isExit é uma variável booleana que indica o fim do loop

       4. O servidor lê os caracteres da conexão socket
       em uma variável dinâmica (buffer).

       5. Um sockaddr_é uma estrutura que contém o endereço de internet
       Essa estrutura já está defininda em netinet/in.h portanto
       não precisamos declarar ela novamente.


        DEFINIÇÃO

        struct sockaddr_in
        {
          short   sin_family;
          u_short sin_port;
          struct  in_addr sin_addr;
          char    sin_zero[8];
        };

        6. serv_addr conterá o endereço do servidor

        7. socklen_t  É um tipo inteiro com tamanho mínimo de 32 bits


    */
    int client, server;
    int portNum = 1500;
    bool isExit = false;
    int bufsize = 1024;
    char buffer[bufsize];

    struct sockaddr_in server_addr;
    socklen_t size;

    /* ---------- ESTABELECENDO CONEXÃO SOCKET ----------*/
    /* -------------- Função socket() ------------------*/

    client = socket(AF_INET, SOCK_STREAM, 0);

    if (client < 0) 
    {
        cout << "\nError establishing socket..." << endl;
        exit(1);
    }

    /*

            A função socket () cria um novo soquete.
            Demora 3 argumentos,

            uma. AF_INET: domínio de endereço do soquete.
            B. SOCK_STREAM: Tipo de soquete. Um soquete de fluxo em
            Quais caracteres são lidos em um fluxo contínuo (TCP)
            C. Terceiro é um argumento de protocolo: sempre deve ser 0. O
            OS escolherá o protocolo mais apropriado.

            Isso retornará um inteiro pequeno e é usado para todos
            Referências a este soquete. Se a chamada de soquete falhar,
            Ele retorna -1.

    */

    cout << "\n=> Servidor socket foi criado com sucesso..." << endl;

    /* 
        A variável serv_addr é uma struct de sockaddr_in.
        sin_family contém um código para a família de endereços.
        deve sempre ser definido como AF_INET.

        INADDR_ANY contém o endereço IP do host. Para o
        código do servidor, este será sempre o endereço IP da
        máquina na qual o servidor está funcionando.

        htons() converte o número da porta da ordem de byte do host
        para um número de porta na ordem de bytes de rede.

    */

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htons(INADDR_ANY);
    server_addr.sin_port = htons(portNum);

    /* ------------- PROCURANDO O SOCKET ------------ */
    /* --------------- Função bind() ---------------- */


    if ((bind(client, (struct sockaddr*)&server_addr,sizeof(server_addr))) < 0) 
    {
        cout << "=> Erro ao encontrar conexão, a conexão socket ja foi estabelecida..." << endl;
        return -1;
    }

    /* 
        A chamada da função bind() liga um socket a um endereço,
        neste caso, o endereço do número atual do host e da porta
        em que o servidor será executado. Possui três argumentos,
        o descritor de arquivo de socket. O segundo argumento é um ponteiro
        para uma struct de tipo sockaddr, e o tamanho desse endereço.
    */

    size = sizeof(server_addr);
    cout << "=> Procurando clientes..." << endl;

    /* ------------- MODO OUVINTE ------------- */
    /* ----------- Função listen() ------------ */

    listen(client, 1);

    /* 

        A chamada da função de escuta ativa o processo escutar
        no socket para conexões.

        O programa permanecerá ocioso aqui se não houver
        conexões incomuns.

        O primeiro argumento é o descritor do arquivo de socket,
        E o segundo é o tamanho do número de clientes
        Ou seja, o número de conexões que o servidor pode
        manipular enquanto o processo está lidando com uma determinada
        conexão. O tamanho máximo permitido pela maioria
        sistemas é 5.

    */

    /* ------------- ACEITANDO CLIENTES  ------------- */
    /* ------------- Função accept() ------------------- */

    /* 

        A chamada da função accept() faz com que o processo aceite
        a conexão com o servidor. Assim, ele acorda quando uma
        conexão de um cliente foi estabelecida com sucesso.
        Ele retorna um novo descritor de arquivo,
        E toda a comunicação sobre esta conexão deve ser feita
        usando o novo descritor de arquivo. O segundo argumento é um
        ponteiro de referência para o endereço do cliente do outro
        lado da conexão, e o terceiro argumento é o tamanho
        desta struct.
    */

    int clientCount = 1;
    server = accept(client,(struct sockaddr *)&server_addr,&size);

    // primeiro verifica se é válido ou não
    if (server < 0) 
        cout << "=> Erro em aceitar..." << endl;

    while (server > 0) 
    {
        strcpy(buffer, "=> Servidor conectado...\n");
        send(server, buffer, bufsize, 0);
        cout << "=> Connectado com o cliente #" << clientCount << endl;
        cout << "\n=> Pressione # para finalizar a conexão\n" << endl;

        /* 
            Note que só chegaríamos a este ponto após saber que
            o cliente foi conectado com sucesso ao nosso servidor.
            Isso é lido a partir do socket. Observe que a read()
            vai bloquear até que haja algo para ler
            no socket, ou seja, depois que o cliente executou um
            send().

            Ele irá ler o número total de caracteres
            no socket ou 1024
        */

        cout << "Client: ";
        do {
            recv(server, buffer, bufsize, 0);
            cout << buffer << " ";
            if (*buffer == '#') {
                *buffer = '*';
                isExit = true;
            }
        } while (*buffer != '*');

        do {
            cout << "\nServer: ";
            do {
                cin >> buffer;
                send(server, buffer, bufsize, 0);
                if (*buffer == '#') {
                    send(server, buffer, bufsize, 0);
                    *buffer = '*';
                    isExit = true;
                }
            } while (*buffer != '*');

            cout << "Client: ";
            do {
                recv(server, buffer, bufsize, 0);
                cout << buffer << " ";
                if (*buffer == '#') {
                    *buffer == '*';
                    isExit = true;
                }
            } while (*buffer != '*');
        } while (!isExit);

        /* 
            Uma vez estabelecida uma conexão, ambas as extremidades
            podem ler e escrever. Naturalmente,
            tudo escrito pelo cliente será lido pelo
            servidor, e tudo escrito pelo servidor será
            lido pelo cliente.
        */

        /* ---------------- FECHAR CHAMADA ------------- */
        /* --------------- Função close() -------------- */

        /* 
           Uma vez que o servidor pressiona # para encerrar a conexão,
           o loop irá quebrar e ele irá fechar a conexão server/client.
        */

        // inet_ntoa converte dados do pacote para IP,que foi obtido do cliente
        cout << "\n\n=> Conexão terminada com o ip " << inet_ntoa(server_addr.sin_addr);
        close(server);
        isExit = false;
        exit(1);
    }

    close(client);
    return 0;
}