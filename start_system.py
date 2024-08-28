import subprocess
import time
import sys

def start_process(command):
    return subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

def main():
    # Start the main application
    app_process = start_process("python backend/app.py")
    print("Started main application")

    # Wait for a few seconds to ensure the main application is up and running
    time.sleep(5)

    # Start multiple simulated devices
    num_pets = 10  # Change this to the number of pets you want to simulate
    device_processes = []
    for pet_id in range(1, num_pets + 1):
        device_process = start_process(f"python simulated_device/device.py {pet_id}")
        device_processes.append(device_process)
        print(f"Started simulated device for Pet {pet_id}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping processes...")
        app_process.terminate()
        for device_process in device_processes:
            device_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()