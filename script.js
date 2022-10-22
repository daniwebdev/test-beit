let requestData = fetch('./data.json').then(res => res.json());

function is_prime(num) {
    
    let isPrime = true;

    // bilangan prima adalah bilangan bulat yang memiliki dua faktor yaitu 1 dan bilangan itu sendiri.

    // jika satu atau kurang dari 1 bukan bilangan prima
    if(num === 1 || num < 1) {

        // menghasilkan nilai balik false
        isPrime = false;

    } else {
        // perulangan dari 2 sampai num - 1
        for(let i = 2; i < num; i++) {

            // ketika 'num' habis dibagi oleh nilai yang kurang dari 'num'
            if(num % i == 0) {

                isPrime = false;

                break; // stop perulangan
            }

        }

    }


    return isPrime;
}

(async function(reqData) {
    let dataJSON = await reqData;
    let dataSample = [];

    for(let i in dataJSON.listNama) {
        dataSample[i] = {
            name: dataJSON.listNama[i],
            value: dataJSON.listNilai[i]
        }
    }

    groupClass = [];

    let reSampling = dataSample.map(function(data, index) {
        let date = new Date();

        data.kelas = undefined;
        data.menikah = undefined;
        
        // mendapatkan nilai puluhan
        let nilaiPuluhan = Math.floor(data.value/10);
        let nilaiSatuan  = (data.value/10).toString().split('.')[1];

        //bulan mati
        let tahunMati = nilaiSatuan < (date.getMonth()+1) ? date.getFullYear()+1:date.getFullYear();

        data.isPrime = is_prime(data.value);

        data.dead = data.isPrime ? `${tahunMati}-${nilaiSatuan}`:'';

        // cek apakah nama dengan hurup C data O
        let includeCandO = data.name.indexOf('C') > -1 && data.name.indexOf('O') > -1;

        //jika nama memiliki karakater 'C' dan 'O' kelas = 'S', jika tidak kelas sesuai dengan nilaiPuluhan
        data.kelas = includeCandO ? 'S' : nilaiPuluhan; 


        // jika kelas 'S'
        if(data.kelas == 'S') {
            if(data.value % 7 == 0) {
                data.menikah = date.getFullYear() + 1
            }
        }

        // grouping kelas
        if(groupClass.indexOf(data.kelas) == -1) {
            groupClass.push(data.kelas);
        }
        
        return data;
        
    });


    // console.log(reSampling);
    // console.log("Grup Kelas",groupClass);
    // console.log("Kelas S", reSampling.filter(i => i.kelas == 'S').length)
    // console.log("Kelas S Nikah", reSampling.filter(i => i.kelas == 'S' && i.menikah > 0).length)


    // Render to screen
    groupClass.forEach(item => {
        let data = reSampling.filter(i => i.kelas == item);

        let title = `<h1 class="kelas-header">Kelas (${item})</h1>`;

        let body  = '<div class="kelas-body">';

            data.forEach(item => {

                let isPrime = '';
                let menikah = '';

                if(item.isPrime) {
                    isPrime = `<span>${item.name} akan mati pada <u>${item.dead}</u> karena ${item.value} adalah bilangan prima.</span>`
                }

                if(data.menikah != undefined) {
                    menikah = `<span>${item.name} akan menikah di tahun ${data.menikah} karena ${item.value} habis dibagi 7</span>`
                }

                body += `
                    <div class="kelas-item">
                        ${item.name} (${item.value})
                        ${isPrime}
                        ${menikah}
                    </div>
                `
            });

        body += '</div>';

        let output = `<div class="kelas-container">${title}${body}</div>`

        $('#output').append(output)


    })

})(requestData)