#include <stdio.h>
#include <stdint.h>
#include <string.h>

char test[] = "<? xml version='1.0' ?><h:rt xmlns h='ProtocolHead'><h:pv>1</h:pv><h:addr>020140000001</h:addr><h:dir>down</h:dir><h:pt>1</h:pt><h:fc>3</h:fc><h:seq>4</h:seq><h:e>00</h:e><h:a>1</h:a><h:r>485845110000000000000004</h:r><h:d>000100010001000DC00104000300002A0000FF0200</h:d><h:sg>E54B44C5144A5EB59D430B40AF9E2741F258D125AB291627330A23E2C12B2366</h:sg></h:rt>";

int main(int argc, char const *argv[]){
	printf("Length : %lu\r\n", strlen(test));
	return 0;
}