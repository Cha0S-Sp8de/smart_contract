using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Troschuetz.Random.Generators;

namespace SpadeGeneratorApp
{
    class Program
    {
        static void Main(string[] args)
        {
			if (args.Length == 5)
			{
				Console.WriteLine("Start");
				var seed = SpadeRundomService.CreateSeed(args[0], args[1], args[2]);
				Console.WriteLine("Seed Array");
				foreach (var item in seed)
				{
					Console.WriteLine(item);
				}

				var winners= SpadeRundomService.Generate(seed, int.Parse(args[3]), long.Parse(args[4]));
				Console.WriteLine("Winners Numbers Start");
				foreach (var item in winners)
				{
					Console.WriteLine(item);
				}
				Console.WriteLine("Winners Numbers End");
			}
			else
			{
				Console.WriteLine("Invalid Argument Lenth!");
			}

			Console.ReadKey();

		}
    }

	public class SpadeRundomService
	{
		public static IList<int> CreateSeed(string ada, string btc, string eth)
		{
			var rs = string.Concat(ada, btc, eth);

			var hasher = SHA256.Create();
			var hashedBytes = hasher.ComputeHash(Encoding.ASCII.GetBytes(rs));

			var size = hashedBytes.Count() / sizeof(int);
			var ints = new int[size];
			for (var index = 0; index < size; index++)
			{
				ints[index] = BitConverter.ToInt32(hashedBytes, index * sizeof(int));
			}

			return ints;
		}

		public static Int64[] Generate(IList<int> seed, int count, long max)
		{
			var arr = new Int64[count];
			var rnd = new MT19937Generator(seed);
			for (int i = 0; i < count; i++)
			{
				arr[i] = Convert.ToInt64(rnd.NextDouble(1, max));
			}
			return arr;
		}
	}
}
