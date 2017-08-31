#include <iostream>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdlib.h>
#include <unistd.h>
#include <netdb.h>

using namespace std;

int main()
{
    /* ---------- INICIALIZANDO VARIÁVEIS ---------- */

    /*
       1.​​O ficheiro cliente armazena os valores retornados
       pela chamada de conexão com o servidor.

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

    int client;
    int portNum = 1500; // NOTE o numero da porta do cliente deve ser a mesma do servidor
    bool isExit = false;
    int bufsize = 1024;
    char buffer[bufsize];
    char* ip = "127.0.0.1";

    struct sockaddr_in server_addr;

    client = socket(AF_INET, SOCK_STREAM, 0);

    /* ---------- ESTABELECENDO CONEXÃO ----------*/
    /* ------------ Função socket()---------------*/

    if (client < 0) 
    {
        cout << "\nErro ao estabelecer conexão..." << endl;
        exit(1);
    }

    /*

            A função socket() cria um novo socket.
            possui 3 argumentos,

            A. AF_INET: domínio de endereço do socket.
            B. SOCK_STREAM: Tipo de socket. Um socket de fluxo no
            qual os caracteres são lidos em um fluxo contínuo (TCP)
            C. Terceiro é um argumento de protocolo: sempre deve ser 0.
            O SO escolherá o protocolo mais apropriado.

            Isso retornará um inteiro e é usado para todas as
            referências a este socket. Se a chamada de socket falhar,
            ele retorna -1.

    */

    cout << "\n=> Socket do cliente foi criado..." << endl;
    
    /* 
        A variável serv_addr é uma struct de sockaddr_in.
        sin_family contém um código para a família de endereços.
        deve sempre ser definido como AF_INET.

        htons() converte o número da porta da ordem de byte do host
        para um número de porta na ordem de bytes de rede.
    */

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(portNum);


    /* esta função retorna 1 se o IP for válido
       e 0 se inválido
       inet_pton converte o IP em pacotes
       inet_ntoa converte pacotes de volta para IP
       inet_pton (AF_INET, ip, & server_addr.sin_addr);

     If (connect (cliente, (struct sockaddr *) & server_addr, sizeof (server_addr)) == 0)
     cout << "=> Conexão ao servidor" << inet_ntoa (server_addr.sin_addr) << "com número de porta:" << portNum << endl; */


    /* ---------- CONNECTANDO O SOCKET ---------- */
    /* ------------ Função connect() ------------ */

    if (connect(client,(struct sockaddr *)&server_addr, sizeof(server_addr)) == 0)
        cout << "=> Connexão a porta numero: " << portNum << endl;

    /* 

        A função de conexão é chamada pelo cliente para
        estabelecer uma conexão com o servidor. Possui
        três argumentos, o descritor do arquivo de socket, o
        endereço do host ao qual deseja se conectar
        (incluindo o número da porta), e o tamanho desse
        endereço.

        Essa função retorna 0 em sucesso e -1
        se ele falhar.

        Observe que o cliente precisa conhecer o número da porta do
        servidor, mas não o seu próprio número de porta.
    */

    cout << "=> Esperando confirmação do servidor..." << endl; //line 40
    recv(client, buffer, bufsize, 0);
    cout << "=> Conexão pronta <=";

    cout << "\n\n=> Pressione # para terminar a conexão\n" << endl;

    // Aqui o cliente pode enviar a mensagem primeiro.

    do {
        cout << "Client: ";
        do {
            cin >> buffer;
            send(client, buffer, bufsize, 0);
            if (*buffer == '#') {
                send(client, buffer, bufsize, 0);
                *buffer = '*';
                isExit = true;
            }
        } while (*buffer != 42);

        cout << "Server: ";
        do {
            recv(client, buffer, bufsize, 0);
            cout << buffer << " ";
            if (*buffer == '#') {
                *buffer = '*';
                isExit = true;
            }

        } while (*buffer != 42);
        cout << endl;

    } while (!isExit);

    /* ---------------- TERMINAR CHAMADA ------------- */
    /* ---------------- Função close() --------------- */

    /* 
         Uma vez que o servidor pressiona # para encerrar a conexão,
         o loop irá quebrar e ele irá fechar a conexão server/client.
    */

    cout << "\n=> Conexão finalizada <=\n";

    close(client);
    return 0;
}